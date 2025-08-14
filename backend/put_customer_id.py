import os
import json
import logging
import boto3
from botocore.exceptions import ClientError  

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

events = boto3.client("events")
EVENT_BUS_NAME = os.getenv("EVENT_BUS_NAME", "default")
EVENT_SOURCE = os.getenv("EVENT_SOURCE", "customer.api")
EVENT_DETAIL_TYPE = os.getenv("EVENT_DETAIL_TYPE", "CustomerCreated")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",  
    "Access-Control-Allow-Headers": "Content-Type,x-api-key",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
}
def cors_response(status_code: int, body: dict):
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body),
    }

def publish_event(customer_id: str):
    payload = {"id": customer_id}
    resp = events.put_events(Entries=[{
        "Source": EVENT_SOURCE,
        "DetailType": EVENT_DETAIL_TYPE,
        "Detail": json.dumps(payload),
        "EventBusName": EVENT_BUS_NAME
    }])
    result = resp.get("Entries", [{}])[0]
    if "ErrorCode" in result:
        logger.error({
            "msg": "EventBridge PutEvents failed",
            "errorCode": result.get("ErrorCode"),
            "errorMessage": result.get("ErrorMessage"),
            "payload": payload
        })
        raise RuntimeError(f"PutEvents failed: {result.get('ErrorCode')}")
    logger.info({"msg": "EventBridge PutEvents ok", "eventId": result.get("EventId"), "payload": payload})

def lambda_handler(event, context):
    try:
        body = event.get("body")
        if isinstance(body, str):
            body = json.loads(body)
        if not body or not isinstance(body.get("id"), str) or not body["id"].strip():
            return cors_response(400, {"error": "Invalid payload: expecting { id: string }"})

        customer_id = body["id"].strip()

        table.put_item(
            Item={"id": customer_id},
            ConditionExpression="attribute_not_exists(#id)",
            ExpressionAttributeNames={"#id": "id"},
        )

        publish_event(customer_id)

        return cors_response(200, {"ok": True, "id": customer_id, "source": "put"})

    except ClientError as e:
        code = e.response.get("Error", {}).get("Code")
        if code == "ConditionalCheckFailedException":
            return cors_response(409, {"ok": False, "error": "ID already exists"})
        logger.exception({"msg": "DynamoDB error", "error": str(e)})
        return cors_response(500, {"ok": False, "error": "DynamoDB error"})

    except Exception as e:
        logger.exception({"msg": "Unhandled error", "error": str(e)})
        return cors_response(500, {"ok": False, "error": "Internal error"})
