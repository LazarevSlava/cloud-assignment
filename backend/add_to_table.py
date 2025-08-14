import os, json, boto3
from botocore.exceptions import ClientError

TABLE = os.environ.get("TABLE_NAME", "customer_ids")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE)

def lambda_handler(event, context):
    cid = (event.get("id") or "").strip()
    if not cid:
        return {"ok": False, "error": "id required"}

    try:
        table.put_item(
            Item={"id": cid},
            ConditionExpression="attribute_not_exists(#id)",
            ExpressionAttributeNames={"#id": "id"}
        )
        return {"ok": True, "id": cid}
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code")
        if code == "ConditionalCheckFailedException":
            return {"ok": False, "error": "ID already exists"}
        raise
