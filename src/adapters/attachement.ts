import Mail from "nodemailer/lib/mailer";

import adaptContent from "./content";

import CONFIG from "../config";

import { Attachment } from "../types/mailtrap";

type NodemailerAttachment = Mail.Attachment;

const { ERRORS } = CONFIG;
const { FILENAME_REQUIRED, CONTENT_REQUIRED } = ERRORS;

/**
 * Adopts Nodemailer attachment to Mailtrap.
 * Checks if filename or content are missing, then rejects with error.
 * Otherwise adapts the content, then builds attachment object for Mailtrap.
 * @todo throw error when only filename is provided
 */
export default function adaptAttachment(
  nodemailerAttachment: NodemailerAttachment
): Attachment {
  if (!nodemailerAttachment.filename) {
    throw new Error(FILENAME_REQUIRED);
  }

  if (!nodemailerAttachment.content) {
    throw new Error(CONTENT_REQUIRED);
  }

  return {
    filename: nodemailerAttachment.filename,
    content: adaptContent(nodemailerAttachment.content),
    disposition: nodemailerAttachment.contentDisposition,
    content_id: nodemailerAttachment.cid,
    type: nodemailerAttachment.contentType,
  };
}
