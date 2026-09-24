import adaptContent from "./content";

import CONFIG from "../config";

import { Attachment } from "../types/mailtrap";
import { NodemailerAttachment } from "../types/transport";

const { ERRORS } = CONFIG;
const { FILENAME_REQUIRED } = ERRORS;

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
    content: adaptContent(nodemailerAttachment.content),
    disposition: nodemailerAttachment.contentDisposition,
    content_id: nodemailerAttachment.cid,
    type: nodemailerAttachment.contentType,
  };
}
