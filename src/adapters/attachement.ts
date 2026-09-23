import CONFIG from "../config";

import { Attachment } from "../types/mailtrap";
import { NodemailerAttachment } from "../types/transport";

const { ERRORS } = CONFIG;
const { FILENAME_REQUIRED, CONTENT_REQUIRED } = ERRORS;

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

  /**
   * Nodemailer resolves every content form it supports into a string or a Buffer before the transport runs, so anything left is not a content we can read: reading it here would bypass options like `disableFileAccess`.
   */
  const { content } = nodemailerAttachment;

  if (
    !content ||
    (typeof content !== "string" && !(content instanceof Buffer))
  ) {
    throw new Error(CONTENT_REQUIRED);
  }

  return {
    filename: nodemailerAttachment.filename,
    content,
    disposition: nodemailerAttachment.contentDisposition,
    content_id: nodemailerAttachment.cid,
    type: nodemailerAttachment.contentType,
  };
}
