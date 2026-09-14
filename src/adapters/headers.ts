import Mail from "nodemailer/lib/mailer";

import { MailtrapHeaders } from "../types/mailtrap";

type Headers = Mail.Headers;

/**
 * Converts a single nodemailer header value to a string.
 * Nodemailer accepts strings, numbers, booleans, dates, address objects, `{ prepared, value }` objects and arrays of these. Returns `undefined`
 * for empty values so the header gets skipped.
 * @todo support multiple value per header
 */
function adaptHeaderValue(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toUTCString();
  }

  if (Array.isArray(value)) {
    return adaptHeaderValue(value[0]); // TODO: support multiple value per header
  }

  if (typeof value === "object") {
    if ("value" in value) {
      return adaptHeaderValue(value.value);
    }

    if ("address" in value) {
      const { name, address } = value as Mail.Address;

      if (!address) {
        return undefined;
      }

      return name ? `${name} <${address}>` : address;
    }
  }

  return undefined;
}

/**
 * Adapts nodemailer headers to mailtrap compatible form.
 * If `nodemailerHeaders` is a { key, value } object or an array of them, then converts to object.
 * Otherwise iterates over the object keys, converting each value to string.
 */
export default function adaptHeaders(
  nodemailerHeaders: Headers
): MailtrapHeaders {
  const entries: Array<[string, unknown]> = (() => {
    if (Array.isArray(nodemailerHeaders)) {
      return nodemailerHeaders.map(({ key, value }) => [key, value]);
    }

    // Single `{ key, value }` header, handled the same way nodemailer does in `setHeader`.
    const { key, value } = nodemailerHeaders as {
      key?: unknown;
      value?: unknown;
    };

    if (typeof key === "string" && "value" in nodemailerHeaders) {
      return [[key, value]];
    }

    return Object.entries(nodemailerHeaders);
  })();

  return entries.reduce((acc, [key, value]) => {
    const adaptedValue = adaptHeaderValue(value);

    if (adaptedValue !== undefined) {
      acc[key] = adaptedValue;
    }

    return acc;
  }, {} as MailtrapHeaders);
}
