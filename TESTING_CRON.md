# Testing the Cron Endpoint

## Local Testing

### 1. Start the development server
```bash
npm run dev
```

### 2. Test the cron endpoint (without auth - should fail)
```bash
curl http://localhost:3000/api/cron/calculate-results
```

Expected response:
```json
{"error":"Unauthorized"}
```

### 3. Generate a secret for testing
```bash
openssl rand -base64 32
```

### 4. Add to your `.env` file
```
CRON_SECRET="your-generated-secret"
```

### 5. Restart dev server and test with auth
```bash
curl -H "Authorization: Bearer your-generated-secret" http://localhost:3000/api/cron/calculate-results
```

Expected response (if today is a trading day):
```json
{
  "success": true,
  "message": "Results calculated successfully",
  "winner": "...",
  ...
}
```

Or (if today is weekend/holiday):
```json
{
  "success": true,
  "message": "Skipped - market closed today",
  "skipped": true
}
```

## Deployment Testing on Vercel

1. Deploy your app to Vercel
2. Add `CRON_SECRET` environment variable in Vercel Dashboard
3. Vercel will automatically run the cron job daily at 4:00 PM IST (10:30 AM UTC)
4. Check Vercel Function Logs to see execution results
5. Manually trigger: Vercel Dashboard → Cron → Select job → "Run Now"
