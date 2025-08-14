import os
import json
import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("TABLE_NAME", "customer_ids"))

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",              
    "Access-Control-Allow-Headers": "Content-Type,x-api-key",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
}
def cors_response(status: int, body: dict):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, ensure_ascii=False),
    }

def lambda_handler(event, context):
    try:
        qs = event.get("queryStringParameters") or {}
        cid = (qs.get("id") or "").strip()

        if not cid:
            return cors_response(400, {"error": "Field 'id' (non-empty string) is required"})

        try:
            table.delete_item(
                Key={"id": cid},
                ReturnValues="ALL_OLD",
                ConditionExpression="attribute_exists(#id)",
                ExpressionAttributeNames={"#id": "id"},
            )
            logger.info({"msg": "Delete OK", "id": cid})
            return cors_response(200, {"deleted": True, "id": cid, "source": "delete"})

        except ClientError as e:
            code = e.response.get("Error", {}).get("Code")
            if code == "ConditionalCheckFailedException":
            
                logger.info({"msg": "Delete: not found", "id": cid})
                return cors_response(200, {"deleted": False, "id": cid, "source": "delete"})
        
            logger.exception({"msg": "DynamoDB error", "error": str(e)})
            return cors_response(500, {"error": "DynamoDB error"})

    except Exception as e:
        logger.exception({"msg": "Unhandled error", "error": str(e)})
        return cors_response(500, {"error": "Internal error"})
