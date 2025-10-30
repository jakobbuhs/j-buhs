// pages/api/sumup/webhook/[token].ts
import type { NextApiRequest, NextApiResponse } from "next";

const MID = process.env.SUMUP_MERCHANT_CODE!;
const TOKEN = process.env.SUMUP_WEBHOOK_TOKEN!; // optional but recommended
const BEARER = process.env.SUMUP_BEARER!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).setHeader("Allow", "POST").end();
  if (req.query.token !== TOKEN) return res.status(401).end();
  if (!req.headers["content-type"]?.toString().startsWith("application/json")) return res.status(415).end();

  const { id, event_type, payload } = (req.body ?? {}) as any;
  if (!id || event_type !== "solo.transaction.updated" || !payload) return res.status(400).end();
  if (payload.merchant_code !== MID) return res.status(403).end();

  // Verify with SumUp (source of truth)
  const url = new URL(`https://api.sumup.com/v2.1/merchants/${MID}/transactions`);
  url.searchParams.set("client_transaction_id", payload.client_transaction_id);

  const r = await fetch(url, { headers: { Authorization: `Bearer ${BEARER}` } });
  // TODO: retry briefly if r.status === 404, reconcile amount/currency/order, persist result

  return res.status(200).json({ ok: true });
}
