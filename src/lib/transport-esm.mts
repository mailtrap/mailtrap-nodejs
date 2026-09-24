import type { MailtrapTransporter } from "../types/transport.js";
import type { MailtrapTransportInstance } from "./transport.js";

/**
 * Same augmentation as in `transport.ts`, for consumers resolving `nodemailer` through its `import` condition.
 * Nodemailer >= 10 ships one set of types per condition, and an augmentation only reaches the copy resolved from the file it is declared in.
 */
declare module "nodemailer" {
  export function createTransport(
    transport: MailtrapTransportInstance
  ): MailtrapTransporter;
}
