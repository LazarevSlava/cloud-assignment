import os, json, boto3

TABLE = os.environ.get("TABLE_NAME", "customer_ids")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE)

def lambda_handler(event, context):
    cid = event.get("id")
    if not cid:
        return {"error": "id required", "exists": None}
    r = table.get_item(Key={"id": cid})
    exists = "Item" in r
    return {"exists": exists, "id": cid}
