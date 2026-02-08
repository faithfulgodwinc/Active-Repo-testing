# Why "Cannot GET /webhook"?

You are seeing `Cannot GET /webhook` in your browser because:
1.  **Browsers use GET**: When you visit a URL in Chrome/Edge, it sends a `GET` request.
2.  **Webhooks use POST**: Your app is configured to only listen for `POST` requests at that address (line 19 of `src/index.ts`).

## How to Test It
You cannot test a webhook by visiting the page. You must send a **POST** request.

### Option A: GitHub (Easiest)
1.  Go to your Repo Settings -> Webhooks.
2.  Click **Redeliver** on a recent delivery.
3.  If configured correctly, GitHub will send a `POST` and get a `200 OK` (or `404` if the URL is wrong).

### Option B: Postman / Curl
```bash
curl -X POST https://active-repo-zeta.vercel.app/webhook \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
```
