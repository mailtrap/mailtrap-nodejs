import adaptAttachment from "./attachement";
import adaptContent from "./content";
import adaptHeaders from "./headers";
import adaptRecipients, { adaptFirstRecipient } from "./recipients";

import CONFIG from "../config";

import { CommonMail, Mail, MailContent, SendError } from "../types/mailtrap";
import { MailtrapMailOptions } from "../types/transport";

const { ERRORS } = CONFIG;
const { SUBJECT_REQUIRED, FROM_REQUIRED } = ERRORS;

/**
 * Checks if `from` property is missing, then returns error.
 * Then gathers common data for mail, then checks if mail es template based. If it is then returns mail.
 * Otherwise checks if subject is missing (if mail is not template based, subject is must), then returns error.
 * Then returns mail with all params needed.
 */
export default function adaptMail(data: MailtrapMailOptions): Mail | SendError {
  const from = adaptFirstRecipient(data.from);

  if (!from?.email) {
    return { success: false, errors: [FROM_REQUIRED] };
  }

  const mail: CommonMail = {
    from,
    to: adaptRecipients(data.to),
    cc: adaptRecipients(data.cc),
    bcc: adaptRecipients(data.bcc),
    reply_to: adaptFirstRecipient(data.replyTo),
  };

  if (data.headers) {
    mail.headers = adaptHeaders(data.headers);
  }

  if (data.attachments) {
    mail.attachments = data.attachments.map(adaptAttachment);
  }

  if (data.customVariables) {
    mail.custom_variables = data.customVariables;
  }

  if (!data.sandbox && data.templateUuid) {
    return {
      ...mail,
      template_uuid: data.templateUuid,
      ...(data.templateVariables && {
        template_variables: data.templateVariables,
      }),
    };
  }

  if (!data.subject) {
    return { success: false, errors: [SUBJECT_REQUIRED] };
  }

  const mailWithSubject: MailContent = {
    ...mail,
    subject: data.subject,
  };

  if (data.category) {
    mailWithSubject.category = data.category;
  }

  if (data.text || data.html) {
    return {
      ...mailWithSubject,
      ...(data.text && { text: adaptContent(data.text) }),
      ...(data.html && { html: adaptContent(data.html) }),
    };
  }

  return mailWithSubject;
}
