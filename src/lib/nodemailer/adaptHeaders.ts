import { Headers } from "nodemailer/lib/mailer";

export default function adaptHeaders(
  nodemailerHeaders: Headers
): Record<string, string> {
  const headers: Record<string, string> = {};
  if (Array.isArray(nodemailerHeaders)) {
    nodemailerHeaders.forEach((header) => {
      headers[header.key] = header.value;
    });
  } else {
    Object.keys(headers).forEach((key) => {
      const value = nodemailerHeaders[key];
      if (typeof value === "string") {
        headers[key] = value;
      } else if (Array.isArray(value)) {
        [headers[key]] = value; // TODO: support multiple value per header
      } else {
        headers[key] = value.value;
      }
    });
  }

  return headers;
}
