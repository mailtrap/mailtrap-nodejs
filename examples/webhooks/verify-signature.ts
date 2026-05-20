import assert from "assert";
import { createHmac } from "crypto";

// In a real project, this import would be `import { verifyWebhookSignature } from "mailtrap";`
import { verifyWebhookSignature } from "../../src";

// --- Direct verification (e.g. for unit tests or custom routers) ----------
const payload = '{"event":"delivery","message_id":"abc-123"}';
const signingSecret = "8d9a3c0e7f5b2d4a6c1e9f8b3a7d5c2e";
const signature = createHmac("sha256", signingSecret)
  .update(payload)
  .digest("hex");

assert.strictEqual(
  verifyWebhookSignature(payload, signature, signingSecret),
  true
);

// Bad input never throws — it returns false:
assert.strictEqual(
  verifyWebhookSignature(payload, "not-hex", signingSecret),
  false
);
assert.strictEqual(verifyWebhookSignature(payload, "", signingSecret), false);
