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
            resp = table.get_item(Key={"id": cid})
            exists = "Item" in resp
            logger.info({"msg": "Get", "id": cid, "exists": exists})
            return cors_response(200, {"exists": exists, "id": cid, "source": "get"})
        except ClientError as e:
            logger.exception({"msg": "DynamoDB error", "error": str(e)})
            return cors_response(500, {"error": "DynamoDB error"})

    except Exception as e:
        logger.exception({"msg": "Unhandled error", "error": str(e)})
        return cors_response(500, {"error": "Internal error"})
