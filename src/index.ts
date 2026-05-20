import MailtrapClient from "./lib/MailtrapClient";
import MailtrapTransport from "./lib/transport";
import verifyWebhookSignature from "./lib/webhooks/verify-signature";

export * from "./types/mailtrap";
export { MailtrapClient, MailtrapTransport, verifyWebhookSignature };
