# 📚 Author Finder – Backend

This repository contains the **backend services** for the Author Finder application.  
Author Finder allows users to **discover**, **explore**, and **save** information about their favorite authors.

This backend is built on a microservice architecture, uses asynchronous processing with AWS SQS, and is designed for scalability and modularity.

---

## 🌍 Production API Gateway

All backend services are routed through the API Gateway exposed by `auth-service`, available at:

👉 **API URL**: `https://api.authorfinder.com/api`  
👉 **Swagger Docs**: `https://api.authorfinder.com/api` (if enabled)

> 📌 Note: The frontend is hosted separately in this repo:  
> [https://github.com/AngeloAlcaraz/ust-training-author-finder-ui](https://github.com/AngeloAlcaraz/ust-training-author-finder-ui)

---

## 🚀 Backend Features

- 🔐 JWT-based Authentication (Signup, Signin, Refresh, Logout)
- 🧩 Modular Microservices (auth, user, favorites)
- ⚙️ Asynchronous processing via AWS SQS and background worker
- 🔄 Integration with external APIs for author data enrichment
- 📦 Dockerized services for easy deployment
- 🧪 Unit Testing with Jest
- 🧹 Static analysis with SonarQube
- 🧵 Load Testing with JMeter
- 🔁 CI/CD pipelines automated with Jenkins

---

## 🧱 Tech Stack

- **NestJS** (auth-service, user-service, favorite-service)
- **TypeScript**
- **Docker**
- **AWS SQS**, **DynamoDB**, **S3**
- **Jest**, **SonarQube**, **JMeter**
- **Jenkins** (CI/CD)
- Hosted on **AWS EC2**

---

## 📐 Architecture Overview

[Frontend (React app - separate repo)]
|
v
[auth-service (API Gateway + Auth)]
|
| |
[user-service] [favorite-service]
|
Call to External API
|
[SQS Queue]
|
[Favorites Worker]
|
[DynamoDB DBs]

## 🧪 Running Locally (Backend Only)

1. **Clone this repo**:
   ```bash
   git clone https://github.com/your-username/author-finder-backend.git
   cd author-finder-backend

2. Set up .env files for each microservice. You can find sample keys in /env-example.
3. Start backend services using Docker: docker-compose up --build
4. Swagger API Docs will be available at: http://localhost:<PORT>/api

📝 Environment Variables
Each service requires a .env file. Typical keys include:
# Common
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Auth Service
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...

# Favorite Service
FAVORITES_QUEUE_URL=...
FAVORITES_TABLE_NAME=...

# User Service
USER_TABLE_NAME=...

# General
PORT_USER_SERVICE=3001
PORT_FAVORITES_SERVICE=3002

🛠️ Deployment
Microservices are containerized and deployed to AWS EC2.

Each microservice uses its own DynamoDB table.

Favorites Worker runs as a background process consuming messages from SQS.

Jenkins handles CI/CD pipelines.

📌 Related Repositories
🖼️ Frontend (React UI):
https://github.com/AngeloAlcaraz/ust-training-author-finder-ui

📄 License
MIT
