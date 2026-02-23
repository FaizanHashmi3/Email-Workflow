# Email Workflow Assignment

## Live Demo

Frontend:
https://email-workflow-1.onrender.com/

Backend:
https://email-workflow-ysdv.onrender.com/

Note: Services may take 30–60 seconds to wake up due to free hosting.

## Overview

This is a simple full-stack Email Workflow system.
It allows users to create workflows and send emails either instantly or at a scheduled time.

The project is built using Next.js for the frontend, Fastify for the backend, MongoDB for database, and n8n for email automation.

---

## Features

* Create email workflows
* Schedule emails for later
* Trigger emails manually
* View workflow execution history
* Gmail integration using OAuth

---

## Tech Stack

**Frontend**

* Next.js
* Axios

**Backend**

* Node.js
* Fastify

**Automation**

* n8n

**Database**

* MongoDB Atlas

**Deployment**

* Render

---

## How it works

1. User creates a workflow from the frontend
2. Frontend sends request to backend
3. Backend saves workflow in MongoDB
4. Backend calls n8n webhook
5. n8n waits until scheduled time
6. Gmail node sends the email
7. Execution status is stored in database

---

## Project Structure

```
email-workflow/
│
├── frontend/
│
├── backend/
│
├── n8n/
│
└── README.md
```

---

## Environment Variables

Backend `.env`

```
MONGO_URI=your_mongodb_uri

N8N_WEBHOOK_URL=your_n8n_webhook_url

CONNECTED_EMAIL=your_email
```

Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=your_backend_url
```

---

## Running Locally

### Backend

```
npm install

node server.js
```

---

### Frontend

```
npm install

npm run dev
```

---

### n8n

```
npx n8n
```

---

## Deployment

All services are deployed on Render:

* Frontend → Render Static Site
* Backend → Render Web Service
* n8n → Render Web Service
* Database → MongoDB Atlas

---

## Example Flow

User schedules email → Backend → n8n → Wait → Gmail → Email sent

---

## Author

Faizan Hashmi

---

## Notes

This project was built as part of an Email Workflow Assignment to demonstrate full-stack development and workflow automation using n8n.
