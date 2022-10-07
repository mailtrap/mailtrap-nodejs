import { Address as NodemailerAddress } from "nodemailer/lib/mailer";
import { Address } from "../types";

export function adaptRecipient(recipient: string | NodemailerAddress): Address {
  if (typeof recipient === "string") {
    return { email: recipient };
  }

  return { name: recipient.name, email: recipient.address };
}

export default function adaptRecipients(
  recipients:
    | string
    | NodemailerAddress
    | Array<string | NodemailerAddress>
    | undefined
): Address[] {
  if (typeof recipients === "undefined") {
    return [];
  }
  if (!Array.isArray(recipients)) {
    return [adaptRecipient(recipients)];
  }

  return recipients.map(adaptRecipient);
}
