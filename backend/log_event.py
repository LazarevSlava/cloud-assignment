import json, logging
logger = logging.getLogger()
logger.setLevel("INFO")

def handler(event, context):
    logger.info({"message": "Customer event", "event": event})
    return {"ok": True}
