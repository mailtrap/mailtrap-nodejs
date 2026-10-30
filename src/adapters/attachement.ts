import adaptContent from "./content";

import CONFIG from "../config";

import { Attachment } from "../types/mailtrap";
import { NodemailerAttachment } from "../types/transport";

const { ERRORS } = CONFIG;
const { FILENAME_REQUIRED } = ERRORS;

/**
 * Returns string content in base64, as the Mailtrap API takes it.
 * Nodemailer encodes a Buffer to base64 itself but leaves a string as it is, so the string is decoded with its `encoding` first.
 */
function encodeContent(
  content: string | Buffer,
  encoding: string | undefined
): string | Buffer {
  if (typeof content !== "string" || encoding?.toLowerCase() === "base64") {
    return content;
  }

  return Buffer.from(content, (encoding || "utf8") as BufferEncoding).toString(
    "base64"
  );
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

  return {
    filename: nodemailerAttachment.filename,
    content: encodeContent(
      adaptContent(nodemailerAttachment.content),
      nodemailerAttachment.encoding
    ),
    disposition: nodemailerAttachment.contentDisposition,
    content_id: nodemailerAttachment.cid,
    type: nodemailerAttachment.contentType,
  };
}
