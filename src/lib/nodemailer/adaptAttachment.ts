import { Attachment as NodemailerAttachment } from "nodemailer/lib/mailer";
import { Attachment } from "../types";

export default function adaptAttachment(
  nodemailerAttachment: NodemailerAttachment
): Attachment {
  if (!nodemailerAttachment.filename) {
    throw new Error("filename is required");
  }

  if (!nodemailerAttachment.content) {
    throw new Error("content is required");
  }

  const content =
    typeof nodemailerAttachment.content === "string" ||
    nodemailerAttachment.content instanceof Buffer
      ? nodemailerAttachment.content
      : nodemailerAttachment.content.read();

  return {
    filename: nodemailerAttachment.filename,
    content,
    disposition: nodemailerAttachment.contentDisposition,
    content_id: nodemailerAttachment.cid,
    type: nodemailerAttachment.contentType,
  };
}
