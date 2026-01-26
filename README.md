# rest-api-staff

## Description

Minimal TypeScript, Hono, REST API following a DDD-style (Domain Driven Design) structure.

## Tech Stack & Tooling

* **Hono** is used as the web framework, providing a fast, lightweight, and standards-based HTTP server.

* **Zod** is used to provide schema validation and runtime type safety to ensure data conforms to expected shapes.

* **Jest** is used for testing, with **dependency injection** to enable isolated, reliable tests.

* **ESLint** for basic linting.

* **ES Modules (ESM)** 

This README shows how to set up, build and manually test the API endpoints using curl.

### Prerequisites

- Node.js 20+ and npm. Verify with:
   node --version
   npm --version

### Quick setup

1. Install dependencies 

    npm install

2. Build the TypeScript sources (output goes to `dist`)

    npm run build

3. Run the app

- Development (auto-restart):

   npm run dev

- Production (run compiled JS):

   npm start

4. Run automated tests

   npm test

By default the server listens on port 3000 (set PORT to change it).

#### What to expect

- POST /staff  — create a staff member. Body must include: firstName, lastName, email.
   - Returns 201 with the created staff object.
   - Returns 400 if required fields are missing or email format is invalid.
   - Returns 409 if an employee with the same email already exists (email is unique).

- GET /staff — list all staff (200)

- DELETE /staff/:id — remove staff by id
   - Returns 204 on success, 404 if not found.

Notes about email handling

- Email is modeled as a domain value object (see `src/domain/email.ts`).
- Email addresses are normalized to lowercase for comparison and storage.
- The Email value object performs basic validation and will cause a 400 response when invalid.

### Manual testing with curl

Replace HOST and PORT if you run the server on a different host/port. The examples assume http://localhost:3000.

Create a staff (happy path)

```bash
curl -i -X POST http://localhost:3000/staff \
   -H "Content-Type: application/json" \
   -d '{"firstName":"Alice","lastName":"Anderson","email":"alice@example.com"}'
```

Create a staff with missing fields (expect 400)

```bash
curl -i -X POST http://localhost:3000/staff \
   -H "Content-Type: application/json" \
   -d '{"firstName":"Bob","email":"bob@example.com"}'
```

Create a staff with invalid email (expect 400)

```bash
curl -i -X POST http://localhost:3000/staff \
   -H "Content-Type: application/json" \
   -d '{"firstName":"X","lastName":"Y","email":"not-an-email"}'
```

Create a staff with duplicate email (expect 409)

```bash
# first create the initial resource (use the command above), then run again with the same email
curl -i -X POST http://localhost:3000/staff \
   -H "Content-Type: application/json" \
   -d '{"firstName":"Alice","lastName":"Another","email":"alice@example.com"}'
```

List all staff

```bash
curl -i http://localhost:3000/staff
```

Delete a staff by id (replace <id> with the actual id from the create/list response)

```bash
curl -i -X DELETE http://localhost:3000/staff/<id>
```

Delete a non-existing id (expect 404)

```bash
curl -i -X DELETE http://localhost:3000/staff/00000000-0000-0000-0000-000000000000
```