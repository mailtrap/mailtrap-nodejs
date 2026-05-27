import { createServer, IncomingMessage, ServerResponse } from "http";

import { verifyWebhookSignature } from "mailtrap";

const SIGNING_SECRET = process.env.MAILTRAP_WEBHOOK_SIGNING_SECRET ?? "";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  // Use the raw request body — parsing and re-serializing the JSON may
  // reorder keys or alter whitespace and invalidate the signature.
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", () => {
    const payload = Buffer.concat(chunks).toString("utf-8");
    const signature = (req.headers["mailtrap-signature"] as string) ?? "";

    if (!verifyWebhookSignature(payload, signature, SIGNING_SECRET)) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Invalid signature");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end();
  });
});

server.listen(9292);
