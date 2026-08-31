# 💰 UPI-SMART

> A secure expense-analysis application that turns receipt or expenditure screenshots into structured financial insights using AI.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#)
[![Built with Next.js](https://img.shields.io/badge/Next.js-black)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248)](#)

---

## 📌 Overview

This project allows users to upload screenshots containing financial information and receive structured expenditure analysis and saving suggestions.

The application is designed around one important principle:

> **Sensitive financial screenshots should exist only for as long as they are actually needed.**

The system therefore separates **persistent financial data** from **temporary upload data**.

* **PostgreSQL** stores persistent, structured application data.
* **MongoDB** stores temporary and schema-flexible upload metadata.
* **Cloudinary** stores uploaded screenshots temporarily.
* **Gemini** processes screenshots and extracts financial information.
* **HttpOnly cookies** are used for authentication sessions.
* **TTL-based expiration and scheduled cleanup** limit the lifetime of temporary data.

The current application is operating at a small scale of approximately **2–5 users** and **10–20 processed screenshots**, but the architecture is designed with security, data lifecycle management, and future scalability in mind.

---

# ✨ Features

* 🔐 Secure cookie-based authentication
* 🛡️ Server-side authorization and ownership checks
* 📤 Secure screenshot uploads
* 📏 5 MB upload size limit
* 🗂️ File-type validation
* 🧹 EXIF metadata removal
* 🖼️ Image resizing and compression with Sharp
* ☁️ Temporary Cloudinary storage
* 🔗 Signed URLs with expiration
* ⏱️ MongoDB TTL-based metadata cleanup
* 🧹 Scheduled Cloudinary cleanup
* 🤖 Gemini-powered financial data extraction
* 📊 Expenditure analysis
* 💡 AI-generated saving suggestions
* 🐘 PostgreSQL for persistent structured data
* 🍃 MongoDB for temporary upload metadata
* 🔷 Prisma for type-safe PostgreSQL access
* 🚀 Vercel deployment

---

# 🏗️ System Architecture

The system is divided into several logical components:

```text
                         ┌──────────────────┐
                         │      Client      │
                         │   Next.js UI     │
                         └────────┬─────────┘
                                  │
                                  │ Authenticated Request
                                  ▼
                         ┌──────────────────┐
                         │   Next.js Server │
                         │ API / Server      │
                         │ Actions          │
                         └───────┬──────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               │                 │                 │
               ▼                 ▼                 ▼
        ┌─────────────┐   ┌─────────────┐   ┌──────────────┐
        │ PostgreSQL  │   │  MongoDB    │   │  Cloudinary  │
        │ Persistent  │   │ Temporary   │   │  Temporary   │
        │ Data        │   │ Metadata    │   │  Files       │
        └─────────────┘   └─────────────┘   └──────┬───────┘
                                                    │
                                                    ▼
                                             ┌──────────────┐
                                             │    Gemini    │
                                             │ AI Pipeline  │
                                             └──────────────┘
```

### 🔗 Architecture Flowchart
<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/c8d93937-d645-40eb-b2d2-f679a35f059c" />


Example:

```markdown
![System Architecture]

# 🔄 Screenshot Processing Flow

The high-level lifecycle of an uploaded screenshot is:

```text
User
 │
 │ Upload Screenshot
 ▼
Next.js Server
 │
 ├── Validate authentication
 │
 ├── Validate file size
 │
 ├── Validate MIME/type
 │
 ├── Process image with Sharp
 │      ├── Remove EXIF metadata
 │      ├── Resize
 │      └── Compress
 │
 ▼
Cloudinary
 │
 │ Temporary file
 ▼
Signed URL
 │
 ▼
MongoDB
 │
 │ Temporary metadata + expiration
 ▼
Gemini
 │
 ├── Merchant
 ├── Total
 ├── Category
 └── Other extracted information
 │
 ▼
Application
 │
 ├── Expenditure analysis
 └── Saving suggestions
 │
 ▼
PostgreSQL
 │
 │ Persistent structured data
 ▼
User
```

### 🖼️ Processing Flow Diagram

---

# 🔐 Security Model

Security is a core part of the architecture because screenshots may contain sensitive financial information.

## Authentication

The application uses **secure, HttpOnly cookie-based sessions**.

Important properties:

* Cookies are not accessible from client-side JavaScript.
* Sessions expire after 24 hours.
* Authentication is validated on the server.
* Protected APIs do not trust client-provided user IDs.
* User identity is derived from the authenticated session.

### Authorization

Authentication answers:

> "Who is this user?"

Authorization answers:

> "Is this user allowed to access this resource?"

Every protected resource should therefore perform an ownership check.

For example:

```text
Request
  ↓
Validate Session
  ↓
Get Authenticated User
  ↓
Find Requested Resource
  ↓
Verify Resource.ownerId === session.userId
  ↓
Allow / Reject
```

This prevents vulnerabilities such as **Insecure Direct Object Reference (IDOR)**.

---

# 📁 File Security

Uploaded screenshots are treated as sensitive temporary data.

The upload pipeline applies multiple layers of protection.

## 1. File Size Limit

Uploads are limited to:

```text
5 MB
```

This helps prevent:

* Excessive resource consumption
* Accidental large uploads
* Basic denial-of-service vectors
* Unexpected image-processing costs

---

## 2. File-Type Validation

The server validates the uploaded file rather than trusting only the client-provided MIME type.

Client-side validation is useful for UX, but it should **never be considered a security boundary**.

```text
Client validation
      ↓
Server validation
      ↓
Image processing
```

---

## 3. EXIF Removal

Images may contain EXIF metadata such as:

* GPS coordinates
* Camera information
* Creation timestamps
* Device information

Images are therefore processed with **Sharp** before further processing/storage.

```text
Original Image
      ↓
Sharp
      ↓
EXIF removed
      ↓
Resize / Compression
      ↓
Sanitized Image
```

---

## 4. Image Resizing and Compression

Sharp is used to normalize uploaded images and reduce unnecessary storage and processing requirements.

```text
Upload
  ↓
Decode
  ↓
Resize
  ↓
Compress
  ↓
Sanitized image
```

---

# ☁️ Temporary File Storage

Screenshots are uploaded to **Cloudinary** as temporary objects.

The application does not treat uploaded screenshots as permanent user data.

The intended lifecycle is:

```text
Upload
  ↓
Temporary Cloudinary object
  ↓
AI processing
  ↓
Result persisted
  ↓
Temporary object expires/deleted
```

This follows a **data minimization** approach.

---

# ⏱️ Temporary Metadata Lifecycle

MongoDB stores temporary upload metadata such as:

```text
uploadId
userId
cloudinaryPublicId
signedUrl / reference
createdAt
expiresAt
processingStatus
```

MongoDB TTL indexes can automatically remove expired metadata.

```text
Document created
      ↓
expiresAt assigned
      ↓
MongoDB TTL monitor
      ↓
Document expires
      ↓
Temporary metadata deleted
```

### Important distinction

MongoDB TTL deletion and Cloudinary file deletion are separate responsibilities.

```text
MongoDB TTL
    │
    └── Deletes temporary metadata

Scheduled Cleanup
    │
    └── Deletes temporary Cloudinary objects
```

This separation is intentional.

---

# 🧹 Automatic Cleanup

Temporary financial screenshots should not remain indefinitely.

The cleanup strategy therefore consists of two mechanisms.

### MongoDB

MongoDB TTL indexes remove expired temporary metadata.

### Cloudinary

A scheduled cleanup process removes expired Cloudinary objects.

```text
                 Temporary Upload
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        MongoDB Metadata       Cloudinary File
             │                     │
             ▼                     ▼
         TTL Index            Scheduled Job
             │                     │
             ▼                     ▼
          Deleted               Deleted
```

> **TODO:** Document the exact cleanup schedule, retry behavior, and failure-handling strategy.

---

# 🤖 AI Processing Pipeline

Gemini is used to extract structured financial information from screenshots.

The pipeline is conceptually:

```text
Screenshot
    ↓
Image preprocessing
    ↓
Gemini
    ↓
Structured extraction
    ├── Merchant
    ├── Total
    ├── Category
    └── Other relevant fields
    ↓
Validation / normalization
    ↓
PostgreSQL
    ↓
Analysis
    ↓
Saving suggestions
```

AI output should be treated as **untrusted input**.

The application should validate and normalize extracted values before persisting them.

For example:

```text
AI says:

total = "₹1,250"

        ↓

Application validation

        ↓

Normalized numeric value

        ↓

Database
```

---

# 🗄️ Database Architecture

The project intentionally uses two databases for different purposes.

## PostgreSQL

PostgreSQL is used for persistent structured application data.

Examples:

* Users
* Expenses
* Categories
* Financial records
* AI-generated structured results
* Relationships between entities

Prisma provides:

* Type-safe queries
* Schema management
* Migrations
* Better developer experience
* Compile-time assistance

```text
Application
     ↓
Prisma
     ↓
PostgreSQL
     ↓
Persistent Data
```

---

## MongoDB

MongoDB is used for temporary and schema-flexible upload metadata.

Examples:

* Temporary upload records
* Processing state
* Cloudinary references
* Expiration timestamps
* Temporary signed URL information

```text
Application
     ↓
MongoDB
     ↓
Temporary Upload Metadata
     ↓
TTL
     ↓
Automatic Expiration
```

### Why not use only one database?

The databases have different responsibilities.

| Requirement                  | PostgreSQL | MongoDB |
| ---------------------------- | ---------: | ------: |
| Relational financial data    |          ✅ |         |
| Strong relationships         |          ✅ |         |
| Transactions                 |          ✅ |         |
| Type-safe schema with Prisma |          ✅ |         |
| Temporary upload metadata    |            |       ✅ |
| Flexible temporary documents |            |       ✅ |
| TTL-based expiration         |            |       ✅ |

This separation should be evaluated against operational complexity as the project grows.

> **Architecture principle:** Don't use two databases simply because both are available. Each database should have a clearly defined responsibility.

---

# 🔑 Authentication Architecture

The current authentication strategy uses:

```text
Browser
  │
  │ Login
  ▼
Server
  │
  ├── Authenticate user
  └── Create session
          │
          ▼
     HttpOnly Cookie
```

For subsequent requests:

```text
Browser
   │
   │ Cookie automatically sent
   ▼
Server
   │
   ├── Validate session
   ├── Identify user
   └── Check authorization
   ▼
Protected Resource
```

## Authentication Security Practices

The implementation should consider:

* `HttpOnly`
* `Secure` in production
* Appropriate `SameSite` policy
* Short session lifetime
* Session invalidation on logout
* Session rotation where appropriate
* CSRF protection where applicable
* Rate limiting authentication endpoints
* Strong password hashing if passwords are managed directly
* Generic login failure messages
* Server-side authorization checks
* Never trusting client-provided user IDs

---

# 🚀 Getting Started

## Prerequisites

Before running the project locally, make sure you have:

* Node.js
* npm / pnpm / yarn
* PostgreSQL
* MongoDB
* Cloudinary account
* Gemini API access

---

## 1. Fork the Repository

If you want to experiment with the project, **fork the repository first**.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Then install dependencies:

```bash
npm install
```

---

## 2. Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Example configuration:

```env
DATABASE_URL=

MONGODB_URI=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

SESSION_SECRET=
```

> Never commit `.env`, `.env.local`, API keys, database credentials, or other secrets to Git.

---

## 3. Set Up PostgreSQL

Configure the PostgreSQL connection:

```env
DATABASE_URL="your-postgresql-connection-string"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

## 4. Configure MongoDB

Configure:

```env
MONGODB_URI="your-mongodb-connection-string"
```

Create the required TTL index for temporary upload metadata.

> **TODO:** Add the exact MongoDB index creation/migration command used by the project.

---

## 5. Configure Cloudinary

Add:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Make sure production credentials are stored securely in the deployment environment.

---

## 6. Configure Gemini

Add your Gemini API key:

```env
GEMINI_API_KEY=
```

Never expose the API key to the browser.

AI requests should be performed from the trusted server environment.

---

## 6.  sending gmail using nodemailer 

Add your google app email and password

```env
EMAIL=
PASSWORD=
```

Never expose the API key to the browser.

AI requests should be performed from the trusted server environment.

---

## 7. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Testing

Automated testing is part of the planned development roadmap.

The testing strategy should eventually cover:

### Authentication

* Login
* Logout
* Expired sessions
* Invalid sessions
* Unauthorized requests
* Ownership checks

### File Uploads

* Valid images
* Oversized files
* Invalid MIME types
* Corrupted images
* EXIF removal
* Image processing failures

### Database

* PostgreSQL persistence
* MongoDB temporary metadata
* TTL expiration
* Transaction failures

### AI Pipeline

* Valid Gemini response
* Malformed AI response
* Missing fields
* Invalid financial values
* API failures/timeouts

### Cleanup

* Expired metadata
* Cloudinary deletion
* Cleanup retries
* Partial failures

---

# 🚦 Rate Limiting

Rate limiting is planned to protect expensive or sensitive operations.

Particularly important endpoints include:

```text
Authentication
     ↓
Login / Signup / Password operations

Upload
     ↓
File processing + storage

AI
     ↓
Gemini API calls
```

AI and image-processing endpoints deserve special attention because they can consume significantly more resources than ordinary API requests.

---

# 🔄 CI/CD

CI/CD automation is planned.

A future pipeline may look like:

```text
Git Push
   ↓
CI
   ├── Lint
   ├── Type Check
   ├── Unit Tests
   ├── Integration Tests
   └── Build
   ↓
Deployment
   ↓
Vercel
```

---

# 🚀 Deployment

The application is designed for production deployment on **Vercel**.

Production configuration should include:

* Environment variables
* PostgreSQL connection
* MongoDB connection
* Cloudinary credentials
* Gemini API credentials
* Secure session configuration
* Scheduled cleanup mechanism
* Rate limiting
* Monitoring/logging

> **TODO:** Add the production deployment URL.

### Production

```text
Live Application:
https://upi-smart.vercel.app/
```

---

# 📸 Screenshots

## Dashboard

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/99273a70-90e4-4aa9-9cf3-d57a645e7cb8" />


```text

docs/screenshots/dashboard.png
```

![Dashboard](docs/screenshots/dashboard.png)

## Upload Flow

<img width="1882" height="907" alt="image" src="https://github.com/user-attachments/assets/2f7b1b5c-5567-4560-8ae8-c031c1f60cb8" />


```text
docs/screenshots/upload.png
```

![Upload](docs/screenshots/upload.png)

## AI Analysis

> <img width="1165" height="892" alt="image" src="https://github.com/user-attachments/assets/10730d53-db9b-4b1d-abb6-cf2f2a9b8dc0" />


```text
docs/screenshots/analysis.png
```

![AI Analysis](docs/screenshots/analysis.png)

---

# 🧩 Project Structure

Example structure:

```text
.
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   └── ...
│
├── components/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── cloudinary/
│   ├── ai/
│   └── security/
│
├── prisma/
│   └── schema.prisma
│
├── workers/
│   └── cleanup/
│
├── docs/
│   ├── architecture/
│   └── screenshots/
│
├── tests/
│
├── .env.example
├── package.json
└── README.md
```

Adjust this structure to match the actual repository.

---

# 📐 Architecture Decisions

The major architecture decisions are documented separately so that implementation details and design rationale remain easy to understand.

| Decision                | Reason                                                                    |
| ----------------------- | ------------------------------------------------------------------------- |
| Next.js                 | Full-stack application framework and unified frontend/server architecture |
| PostgreSQL              | Persistent relational financial data                                      |
| Prisma                  | Type-safe PostgreSQL access                                               |
| MongoDB                 | Temporary schema-flexible upload metadata                                 |
| Cloudinary              | Temporary image/object storage                                            |
| Sharp                   | Image sanitization, resizing and compression                              |
| HttpOnly cookies        | Secure browser-based session handling                                     |
| Gemini                  | AI-based financial information extraction                                 |
| Vercel                  | Production deployment                                                     |
| TTL + scheduled cleanup | Minimize lifetime of sensitive temporary data                             |

---

# 🔒 Security Philosophy

The most important architectural constraint is the lifecycle of sensitive screenshots.

The system aims to follow:

```text
Collect
   ↓
Validate
   ↓
Sanitize
   ↓
Process
   ↓
Extract required information
   ↓
Persist only necessary structured data
   ↓
Delete temporary data
```

The objective is not simply to "secure the upload."

It is to secure the **entire lifecycle of the data**.

---

# 🛣️ Roadmap

* [ ] Automated unit tests
* [ ] Integration tests
* [ ] End-to-end tests
* [ ] Rate limiting
* [ ] Background worker infrastructure
* [ ] Automated Cloudinary cleanup
* [ ] Improved monitoring
* [ ] Structured logging
* [ ] Error tracking
* [ ] Retry strategy for failed AI processing
* [ ] Improved AI output validation
* [ ] Production security audit
* [ ] CI/CD pipeline
* [ ] Detailed architecture documentation
* [ ] Threat model documentation
* [ ] Performance/load testing

---

# 🤝 Contributing

Contributions are welcome.

The easiest way to get started is:

1. **Fork this repository**
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests and checks
6. Commit your changes
7. Open a Pull Request

```bash
git checkout -b feature/your-feature
```

Please consider opening an issue before implementing large architectural changes.

---

# 🍴 Fork This Project

Want to experiment with the architecture?

**Fork it. Break it. Improve it.**

You can use this project to experiment with:

* Next.js architecture
* Secure file uploads
* PostgreSQL + MongoDB
* AI pipelines
* Temporary object storage
* Authentication
* Data lifecycle management
* Background jobs
* Production security

If you build something interesting from this project, feel free to open a Pull Request or share your implementation.

---

# 📚 Architecture & Engineering Blog Series

The architecture behind this project is intentionally documented as a series of engineering decisions.

Planned articles:

1. **Next.js vs Express.js: Choosing a Backend Architecture**
2. **PostgreSQL vs MongoDB: Choosing the Right Database**
3. **How to Secure File Uploads**
4. **Server-Mediated Uploads vs Direct-to-Object-Storage Uploads**
5. **Cookie Sessions vs JWT Authentication**
6. **Designing a Secure Lifecycle for Sensitive Financial Files**
7. **Using MongoDB TTL for Temporary Data**
8. **Designing Reliable Background Cleanup Jobs**
9. **Building a Secure AI Document Processing Pipeline**
10. **Threat Modeling a Financial Screenshot Processing Application**

---

# 📄 License

Add your chosen license here.

Example:

```text
MIT License
```

---

# 🙌 Acknowledgements

Built with:

* Next.js
* PostgreSQL
* Prisma
* MongoDB
* Cloudinary
* Sharp
* Gemini
* Vercel

---

## 🔗 Useful Links

* **Live Demo:** https://upi-smart.vercel.app/
* **Repository:** https://github.com/YuktaAgnihotri/UPI-Smart/
* **Blog Series:** https://backend-design.hashnode.dev/
