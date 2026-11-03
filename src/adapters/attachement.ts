import adaptContent from "./content";

import CONFIG from "../config";

import { Attachment } from "../types/mailtrap";
import { NodemailerAttachment } from "../types/transport";

const { ERRORS } = CONFIG;
const { FILENAME_REQUIRED } = ERRORS;

function isUtf8Text(
  content: string | Buffer,
  encoding: string | undefined
): content is string {
  return typeof content === "string" && encoding?.toLowerCase() !== "base64";
}

/**
 * Returns string content in base64, as the Mailtrap API takes it.
 * Nodemailer decodes a string with a non-text `encoding` and marks it `base64`, so any other string is text, which it sends as UTF-8.
 */
function encodeContent(
  content: string | Buffer,
  encoding: string | undefined
): string | Buffer {
  if (!isUtf8Text(content, encoding)) {
    return content;
  }

  return Buffer.from(content, "utf8").toString("base64");
}

/**
 * Labels non-ASCII text/plain as UTF-8, the bytes encodeContent produces, as Nodemailer's SMTP path does.
 */
function adaptType(
  type: string | undefined,
  content: string | Buffer,
  encoding: string | undefined
): string | undefined {
  if (
    !type ||
    !/^text\/plain\s*(;|$)/i.test(type) ||
    !isUtf8Text(content, encoding) ||
    !/[\u0080-￿]/.test(content)
  ) {
    return type;
  }

  return `${type.replace(/\s*;\s*charset=[^;]*/i, "")}; charset=utf-8`;
}

/**
 * Adopts Nodemailer attachment to Mailtrap.
 * Checks if filename or content are missing, then rejects with error.
 * Otherwise builds attachment object for Mailtrap.
 * @todo throw error when only filename is provided
 */
export default function adaptAttachment(
  nodemailerAttachment: NodemailerAttachment
): Attachment {
  if (!nodemailerAttachment.filename) {
    throw new Error(FILENAME_REQUIRED);
  }

  const content = adaptContent(nodemailerAttachment.content);
  const { encoding } = nodemailerAttachment;

  return {
    filename: nodemailerAttachment.filename,
    content: encodeContent(content, encoding),
    disposition: nodemailerAttachment.contentDisposition,
    content_id: nodemailerAttachment.cid,
    type: adaptType(nodemailerAttachment.contentType, content, encoding),
  };
}
