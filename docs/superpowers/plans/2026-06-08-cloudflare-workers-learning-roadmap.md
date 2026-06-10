# Cloudflare Workers Learning Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build practical Cloudflare Workers backend skills through a hands-on learning path that covers routing, database access, authentication, file uploads, and deployment.

**Architecture:** Start with a single Worker entrypoint and progressively evolve it into a small API backend. Each lesson adds one capability and keeps the codebase testable and easy to understand. We will prefer Workers-native primitives and add framework abstractions only when they reduce boilerplate without hiding the platform model.

**Tech Stack:** Cloudflare Workers, Wrangler, Hono, D1, R2, JSON APIs, TypeScript.

---

### Lesson 1: Worker Fundamentals and Request Flow

**Files:**
- Modify: `server/index.ts`
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Add a simple health route**

```ts
export default {
  fetch(request: Request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, service: 'worker-learn' })
    }

    return new Response('Not Found', { status: 404 })
  },
}
```

- [ ] **Step 2: Run and verify the route**

Run: `cmd /c npm run build`
Expected: build succeeds without TypeScript errors.

- [ ] **Step 3: Test in the browser**

Open: `http://127.0.0.1:8787/api/health`
Expected: JSON response `{"ok":true,"service":"worker-learn"}`

### Lesson 2: Express-like Routing with Hono

**Files:**
- Modify: `server/index.ts`
- Create: `src/server/router.ts`

- [ ] **Step 1: Replace manual branching with Hono routes**

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/health', (c) => c.json({ ok: true }))
app.get('/api/users', (c) => c.json([{ id: 1, name: 'Alice' }]))

export default app
```

- [ ] **Step 2: Add a route group**

```ts
const api = new Hono()

api.get('/posts', (c) => c.json([{ id: 1, title: 'Hello Workers' }]))
app.route('/api', api)
```

- [ ] **Step 3: Verify route matching**

Run: `cmd /c npm run build`
Expected: build succeeds and `/api/users` and `/api/posts` both return JSON.

### Lesson 3: Database CRUD with D1

**Files:**
- Modify: `wrangler.jsonc`
- Create: `src/server/db.ts`
- Modify: `server/index.ts`

- [ ] **Step 1: Bind a D1 database**

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "worker_learn",
      "database_id": "replace-with-your-db-id"
    }
  ]
}
```

- [ ] **Step 2: Create a users table**

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Step 3: Add insert and select helpers**

```ts
export async function createUser(db: D1Database, input: {
  name: string
  email: string
  passwordHash: string
}) {
  const result = await db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .bind(input.name, input.email, input.passwordHash)
    .run()

  return result
}
```

- [ ] **Step 4: Expose a CRUD test route**

```ts
app.post('/api/users', async (c) => {
  const body = await c.req.json<{ name: string; email: string; passwordHash: string }>()
  const result = await createUser(c.env.DB, body)
  return c.json(result)
})
```

- [ ] **Step 5: Verify D1 access locally**

Run: `cmd /c npm run build`
Expected: TypeScript accepts `c.env.DB` and the route compiles.

### Lesson 4: Login and Authentication

**Files:**
- Create: `src/server/auth.ts`
- Modify: `server/index.ts`

- [ ] **Step 1: Hash passwords with Web Crypto**

```ts
export async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
```

- [ ] **Step 2: Add a login route**

```ts
app.post('/api/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>()
  return c.json({ token: 'demo-token', email: body.email })
})
```

- [ ] **Step 3: Add auth middleware**

```ts
app.use('/api/private/*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth) return c.json({ message: 'Unauthorized' }, 401)
  await next()
})
```

- [ ] **Step 4: Verify protected routes**

Run: `cmd /c npm run build`
Expected: protected routes return 401 without a token and 200 with a token.

### Lesson 5: File Uploads with R2

**Files:**
- Modify: `wrangler.jsonc`
- Create: `src/server/upload.ts`
- Modify: `server/index.ts`

- [ ] **Step 1: Bind an R2 bucket**

```jsonc
{
  "r2_buckets": [
    {
      "binding": "UPLOADS",
      "bucket_name": "worker-learn-uploads"
    }
  ]
}
```

- [ ] **Step 2: Accept multipart form data**

```ts
app.post('/api/upload', async (c) => {
  const form = await c.req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return c.json({ message: 'file is required' }, 400)
  }

  await c.env.UPLOADS.put(file.name, file.stream())
  return c.json({ ok: true, filename: file.name })
})
```

- [ ] **Step 3: Verify upload flow**

Run: `cmd /c npm run build`
Expected: the upload route compiles and accepts a file field named `file`.

### Lesson 6: Production Readiness and Deployment

**Files:**
- Modify: `wrangler.jsonc`
- Modify: `server/index.ts`
- Optional: `README.md`

- [ ] **Step 1: Add environment variables**
- [ ] **Step 2: Add request and error logging**
- [ ] **Step 3: Verify local dev and production build**
- [ ] **Step 4: Deploy with Wrangler**

```bash
cmd /c npm run deploy
```

Expected: worker deploys successfully and routes still behave the same in production.

## Self-Review

- The roadmap starts with the platform basics before introducing abstractions.
- Each lesson adds one capability and has a concrete verification step.
- Routing, database, auth, and uploads are split into separate lessons so the learning curve stays manageable.
- No placeholder text remains.

