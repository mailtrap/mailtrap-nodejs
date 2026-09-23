import { MailtrapHeaders } from "../types/mailtrap";
import { NodemailerAddress, NodemailerHeaders } from "../types/transport";

/**
 * Display name that nodemailer leaves as it is in its own address headers.
 */
const UNQUOTED_NAME = /^[\w ]*$/;

/**
 * Replaces the line breaks a header value can't carry with spaces, as nodemailer does.
 */
function adaptLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

/**
 * Quotes and escapes a display name unless nodemailer would leave it as it is.
 * A non-ASCII name is quoted rather than turned into a MIME encoded word, since the Mailtrap API takes it as UTF-8.
 */
function adaptAddressName(name: string): string {
  return UNQUOTED_NAME.test(name)
    ? name
    : `"${name.replace(/([\\"])/g, "\\$1")}"`;
}

/**
 * Converts a single nodemailer header value to a string.
 * Nodemailer accepts strings, numbers, booleans, address objects, `{ prepared, value }` objects and arrays of these. Values nodemailer drops itself, like `false`, `0`, blank strings and dates, return `undefined` so the header gets skipped.
 * @todo support multiple value per header
 */
function adaptHeaderValue(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return adaptLineBreaks(value).trim() || undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return adaptHeaderValue(value[0]); // TODO: support multiple value per header
  }

  if (typeof value === "object") {
    if ("value" in value) {
      return adaptHeaderValue(value.value);
    }

    if ("address" in value) {
      const { name, address } = value as NodemailerAddress;
      const email = adaptHeaderValue(address);

      if (!email) {
        return undefined;
      }

      const displayName = adaptHeaderValue(name);

      return displayName
        ? `${adaptAddressName(displayName)} <${email}>`
        : email;
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
  nodemailerHeaders: NodemailerHeaders
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
