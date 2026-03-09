# Rayeva AI Systems

> AI-Powered Modules for Sustainable Commerce — MERN Stackk

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Modules](#modules)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [AI Prompt Design](#ai-prompt-design)
- [Module 3 & 4 Architecture Outlines](#module-3--4-architecture-outlines)

---

## Overview

This project implements two fully functional AI-powered modules and outlines architecture for two more:

| Module | Status | Description |
|--------|--------|-------------|
| **Module 1** | ✅ Implemented | AI Auto-Category & Tag Generator |
| **Module 2** | ✅ Implemented | AI B2B Proposal Generator |
| **Module 3** | 📐 Outlined | AI Impact Reporting Generator |
| **Module 4** | 📐 Outlined | AI WhatsApp Support Bot |

---

## Architecture

```
Rayena_project/
├── backend/                    # Express.js API server
│   ├── config/
│   │   ├── db.js               # MongoDB connection (Mongoose)
│   │   └── env.js              # Environment variable loader
│   ├── middleware/
│   │   └── errorHandler.js     # Global error middleware
│   ├── models/
│   │   ├── AILog.js            # Prompt/response logging schema
│   │   ├── B2BProposal.js      # Module 2 data schema
│   │   └── CatalogResult.js    # Module 1 data schema
│   ├── routes/
│   │   ├── module1Routes.js    # /api/module1/* endpoints
│   │   └── module2Routes.js    # /api/module2/* endpoints
│   ├── services/
│   │   ├── aiClient.js         # OpenAI wrapper + fallback + logging
│   │   ├── categoryService.js  # Module 1 business logic
│   │   └── proposalService.js  # Module 2 business logic
│   ├── server.js               # Express entry point
│   ├── package.json
│   └── .env.example
├── frontend/                   # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CategoryGenerator.jsx
│   │   │   ├── ProposalGenerator.jsx
│   │   │   └── AILogs.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind directives
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

### Design Principles

1. **Separation of AI and Business Logic** — AI calls live in `services/aiClient.js`; domain validation and DB persistence live in `categoryService.js` / `proposalService.js`.
2. **Structured JSON Outputs** — Every AI response is parsed, validated, and clamped to predefined schemas before storage.
3. **Prompt + Response Logging** — All interactions (success, error, fallback) are stored in the `AILog` MongoDB collection.
4. **Environment-Based Key Management** — API keys and config loaded via `.env` through `dotenv`.
5. **Graceful Fallback** — When no OpenAI key is configured or the API fails, deterministic mock logic generates realistic data so the app is always demo-ready.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, React Router 6 |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| AI | Anthropic Claude API (with mock fallback) |
| HTTP Client | Axios |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- (Optional) OpenAI API key

### 1. Backend Setup

```bash
cd backend
cp .env.example .env          # edit .env with your MongoDB URI & OpenAI key
npm install
npm run dev                   # starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:3000 (proxies /api → :5000)
```

### 3. Open in Browser

Navigate to `http://localhost:3000` to see the dashboard.

> **Note:** The app works fully without an OpenAI key — it uses intelligent fallback logic to generate realistic mock data.

---

## API Endpoints

### Module 1 — Auto-Category & Tag Generator

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/module1/generate` | Generate categories + tags for a product |
| `GET` | `/api/module1/results` | List all stored results |
| `GET` | `/api/module1/meta` | Get predefined categories & filters |

**POST body:**
```json
{
  "product_name": "Bamboo Toothbrush Set",
  "product_description": "Eco-friendly toothbrush made from sustainable bamboo with charcoal-infused bristles",
  "material": "Bamboo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "primary_category": "Personal Care",
    "sub_category": "Oral Care",
    "seo_tags": ["bamboo toothbrush", "eco-friendly", "charcoal bristles", "sustainable", "plastic-free oral care"],
    "sustainability_filters": ["plastic-free", "biodegradable", "vegan"],
    "confidence_score": 0.92
  }
}
```

### Module 2 — B2B Proposal Generator

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/module2/generate` | Generate a B2B proposal |
| `GET` | `/api/module2/proposals` | List all stored proposals |

**POST body:**
```json
{
  "client_name": "GreenCorp Ltd.",
  "industry": "Hospitality",
  "budget": 50000,
  "requirements": "Eco-friendly amenities for hotel rooms"
}
```

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/logs` | View all AI prompt/response logs |

---

## AI Prompt Design

### Strategy

Both modules use a **system + user prompt** pattern:

1. **System prompt** defines the AI's role, output schema (exact JSON keys), and constraints (e.g., predefined category list, budget limits).
2. **User prompt** injects the actual input data.
3. Claude's response is post-processed to extract JSON (handles markdown code fences automatically).

### Module 1 Prompt Design

The system prompt:
- Constrains `primary_category` to one of 12 predefined categories
- Constrains `sustainability_filters` to a known filter list
- Requests exactly 5–10 SEO tags
- Asks for a `confidence_score` float

Post-processing validates every field, clamps to allowed values, and pads SEO tags to minimum 5 if the AI under-generates.

### Module 2 Prompt Design

The system prompt:
- Defines exact JSON structure for product mix, budget allocation, cost breakdown
- Explicitly states "total must not exceed the budget"
- Requests sustainability-focused product alternatives

Post-processing rescales budget allocation if the AI exceeds the budget, ensuring business-logic correctness independent of AI output quality.

### Fallback Strategy

When the OpenAI API is unavailable:
- **Module 1:** Uses keyword matching against the product text to select category, generates tags from product words, checks text for sustainability keywords.
- **Module 2:** Creates a realistic 5-product mix with proportional quantities based on budget, uses fixed allocation ratios (65% products, 10% packaging, 15% logistics, 10% margin).

---

## Module 3 & 4 Architecture Outlines

### Module 3: AI Impact Reporting Generator

**Purpose:** Estimate and display sustainability impact metrics for an order.

**Proposed Architecture:**

```
backend/
├── models/ImpactReport.js        # Schema: plastic_saved_kg, carbon_avoided_kg, local_sourcing_summary, impact_statement
├── services/impactService.js     # Business logic: compute impact from order items
│   ├── calculatePlasticSaved()   # Compare weight of conventional vs eco packaging
│   ├── estimateCarbonAvoided()   # Distance-based sourcing × emission factor
│   └── localSourcingImpact()     # % of products sourced within region
├── routes/module3Routes.js       # POST /api/module3/generate { order_id }
│                                 # GET  /api/module3/reports
frontend/
├── src/pages/ImpactReport.jsx    # Visual dashboard with charts
```

**AI Prompt Strategy:**
- System prompt receives order item list with weights, materials, and origin
- Returns structured JSON with estimated metrics
- Human-readable impact statement generated as narrative text
- Fallback uses fixed conversion factors (e.g., 1 bamboo item ≈ 12g plastic saved)

**Key Business Logic:**
- Plastic saved = Σ (conventional_weight - eco_weight) per item
- Carbon avoided = Σ (distance_saved_km × 0.0002 kg CO₂/km/kg)
- Store impact report linked to order ID

---

### Module 4: AI WhatsApp Support Bot

**Purpose:** Handle customer queries via WhatsApp using real database data.

**Proposed Architecture:**

```
backend/
├── models/Conversation.js         # Schema: phone, messages[], status, escalated
├── services/whatsappService.js    # Business logic
│   ├── handleOrderStatus()        # Lookup order in DB, return tracking info
│   ├── handleReturnPolicy()       # Return predefined policy + AI context
│   ├── detectEscalation()         # Flag refund/complaint keywords → escalate
│   └── logConversation()          # Store full thread in MongoDB
├── routes/module4Routes.js        # POST /api/module4/webhook (Twilio/Meta webhook)
│                                  # GET  /api/module4/conversations
├── config/whatsapp.js             # Twilio/Meta API credentials
frontend/
├── src/pages/ConversationLogs.jsx # Admin view of all bot conversations
```

**AI Prompt Strategy:**
- System prompt defines bot persona, response rules, escalation triggers
- User message + relevant DB context (order status, return window) injected
- AI generates response; if confidence is low or keywords match (refund, legal, urgent), auto-escalate to human
- Every message pair logged to `Conversation` collection

**Integration:**
- Twilio API or Meta WhatsApp Business API for message send/receive
- Webhook endpoint receives incoming messages
- Bot responds within 5 seconds or queues for human agent

---

## Evaluation Criteria Mapping

| Criteria | How Addressed |
|----------|---------------|
| **Structured AI Outputs** | Mongoose schemas enforce shape; Claude JSON auto-extraction + validation |
| **Business Logic Grounding** | Budget clamping, category validation, fallback with real business rules |
| **Clean Architecture** | Layered: routes → services → AI client → models |
| **Practical Usefulness** | Works without API key via fallback; production-ready error handling |
| **Creativity & Reasoning** | Smart fallback logic, confidence scoring, automatic SEO tag padding |
