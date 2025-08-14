# Customer ID Management System

This project implements a cloud-native, event-driven system to manage Customer IDs.  
It was built as part of a take-home assignment and demonstrates backend, frontend, and AWS integration.

## Architecture

The architecture includes:

-   **Frontend:** React SPA hosted on AWS S3 + CloudFront
-   **Backend:** AWS Lambda functions exposed via API Gateway
-   **Database:** DynamoDB table `customer_ids`
-   **Workflow:** AWS Step Functions triggered by EventBridge
-   **Monitoring:** AWS CloudWatch for logs and metrics

![Architecture Diagram](docs/architecture.png)

For a detailed explanation, see [docs/architecture.md](./docs/architecture.md).

## Live Links

-   **Frontend (CloudFront):** [Your CloudFront URL]
-   **Backend API (API Gateway):** [Your API Gateway Invoke URL]

## Backend

The backend is implemented using **AWS Lambda** with **API Gateway** and **DynamoDB**.  
The function code is provided in the [`backend/`](./backend) folder for reference.

**Lambda function structure:**

-   `put_customer_id.py` — adds a new Customer ID to the DynamoDB table.
-   `get_customer_id.py` — checks if a Customer ID exists.
-   `delete_customer_id.py` — deletes a Customer ID.
-   `validate_id.py` — validates the ID within Step Functions.
-   `log_event.py` — logs events within Step Functions.
-   `add_to_table.py` — adds a new ID to the table within Step Functions.

> These functions run in AWS Lambda and are connected through API Gateway.  
> They require an AWS environment to run locally, so the code is provided for reference purposes only.

## Missions

### Mission 1 — REST API Backend

-   Created DynamoDB table `customer_ids` (PK: `id`)
-   Implemented Lambda functions for add/check/delete operations
-   Exposed via API Gateway with API key authentication
-   Added error handling, validation, and structured logging

### Mission 2 — React Frontend

-   Single-page app with forms to add, check, and delete Customer IDs
-   Real-time feedback and status messages
-   Styled with Tailwind CSS and deployed to AWS S3 + CloudFront
-   Configured Origin Access Control for secure S3 access

### Mission 3 — Event-Driven Step Function Workflow

-   Step Functions workflow to validate and log new Customer IDs
-   Triggered by EventBridge on new submissions
-   Monitored with CloudWatch metrics and alarms

Detailed Mission 3 execution and screenshots: [docs/mission3.md](./docs/mission3.md).

## How to Run Locally

The backend requires AWS resources and cannot run fully offline.  
You can run the frontend locally by:

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Screenshots

Screenshots are available in [docs/mission3_screenshots/](./docs/mission3_screenshots).

## License

This project is for demonstration purposes as part of a technical assessment.

## Environment variables

Create `.env` from `.env.example` and fill in real values:

```bash
cp .env.example .env
```
