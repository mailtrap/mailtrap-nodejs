import { Options } from "nodemailer/lib/mailer";
import { Mail, SendError } from "../types";
import adaptAttachment from "./adaptAttachment";
import adaptContent from "./adaptContent";
import adaptHeaders from "./adaptHeaders";
import adaptRecipients, { adaptRecipient } from "./adaptRecipients";

export default function adaptMessage(data: Options): Mail | SendError {
  if (typeof data.subject === "undefined") {
    return { success: false, errors: ["subject is required"] };
  }
  if (typeof data.from === "undefined") {
    return { success: false, errors: ["from is required"] };
  }

  const mail: Mail = {
    subject: data.subject,
    from: adaptRecipient(data.from),
    to: adaptRecipients(data.to),
    cc: adaptRecipients(data.cc),
    bcc: adaptRecipients(data.bcc),
    category: "", // string;
    custom_variables: "", // Record<string, string | number | boolean>;
  };

  if (data.headers) {
    mail.headers = adaptHeaders(data.headers);
  }

  if (data.text) {
    mail.text = adaptContent(data.text);
  }

  if (data.html) {
    mail.html = adaptContent(data.html);
  }

  if (data.attachments) {
    mail.attachments = data.attachments.map(adaptAttachment);
  }

  return mail;
}
