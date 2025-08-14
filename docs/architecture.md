# Architecture Diagram

```mermaid
flowchart LR
  subgraph Client
    A[React SPA \n S3 (private) + CloudFront (HTTPS)]
  end

  subgraph API
    B[API Gateway (REST)\nUsage plan + API key]
    C1[Lambda: put_customer_id]
    C2[Lambda: get_customer_id]
    C3[Lambda: delete_customer_id]
  end

  subgraph Data
    D[(DynamoDB\ncustomer_ids)]
  end

  subgraph Events
    E[EventBridge Rule\ncustomer-created-to-sfn]
    F[Step Functions\nState machine]
    V[Lambda: validate_id]
    L[Lambda: log_event]
    A2[Lambda: add_to_table]
  end

  subgraph Observability
    CW[CloudWatch Logs & Metrics]
  end

  A -->|HTTPS| B
  B -->|POST /customer| C1
  B -->|GET /customer?id=...| C2
  B -->|DELETE /customer?id=...| C3

  C1 --> D
  C2 --> D
  C3 --> D

  C1 -->|PutEvents: customer.added| E
  E --> F
  F --> V
  V -->|exists == true| L
  V -->|exists == false| A2
  A2 --> D

  %% Observability
  B --> CW
  C1 --> CW
  C2 --> CW
  C3 --> CW
  F --> CW
  V --> CW
  L --> CW
  A2 --> CW
```

**Notes**
- Frontend is a static React app hosted on S3 and served via CloudFront (OAC/OAI to keep the bucket private).
- API Gateway is secured with an API key and a usage plan (throttling).
- Lambda functions use a least‑privilege IAM role (DynamoDB access; `events:PutEvents` for `put_customer_id`).
- EventBridge rule forwards `customer.added` events to a Step Functions state machine.
- Step Functions orchestrates three lambdas: `validate_id` → `log_event` *or* `add_to_table`.
- All services emit logs/metrics to CloudWatch for troubleshooting and alarms.
