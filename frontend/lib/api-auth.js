import { db } from "@/lib/db";
export async function authenticateApiKey(req) {
  const apiKey = req.headers.get("x-client-id");
  const apiSecret = req.headers.get("x-client-secret");

  if (!apiKey || !apiSecret) {
    return { error: "Missing API credentials", status: 401 };
  }
  const result = await db.query(
    `SELECT id, business_name, status 
     FROM merchants 
     WHERE api_key = $1 AND api_secret = $2 AND status = 'active'
     LIMIT 1`,
    [apiKey, apiSecret]
  );
  if (result.rows.length === 0) {
    return { error: "Invalid API credentials", status: 401 };
  }
  return { merchant: result.rows[0], status: 200 };
}