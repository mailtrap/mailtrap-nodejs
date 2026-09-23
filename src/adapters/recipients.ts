import { Address } from "../types/mailtrap";
import { NodemailerAddress, NodemailerRecipients } from "../types/transport";

/**
 * Flattens nodemailer recipients into a plain list of string or address objects.
 * An address group (`{ name, group: [...] }`) is expanded into its members, unless it carries an address of its own, which nodemailer keeps instead.
 */
function flattenRecipients(
  recipients: NodemailerRecipients
): Array<string | NodemailerAddress> {
  if (Array.isArray(recipients)) {
    return recipients.flatMap(flattenRecipients);
  }

  if (
    typeof recipients !== "string" &&
    !recipients.address &&
    recipients.group
  ) {
    return flattenRecipients(recipients.group);
  }

  return [recipients];
}

/**
 * If type of `recipient` is string, then wraps it into email object.
 * Otherwise maps into { `name`, `email` } pair, `name` being optional in nodemailer.
 */
export function adaptSingleRecipient(
  recipient: string | NodemailerAddress
): Address {
  if (typeof recipient === "string") {
    return { email: recipient.trim() };
  }

  const name = recipient.name?.trim();

  return {
    ...(name && { name }),
    email: recipient.address?.trim() ?? "",
  };
}

/**
 * If there is no recipient, then returns empty array.
 * Otherwise flattens recipients and adopts each one for Mailtrap.
 * Recipients without an address are left out, as nodemailer leaves them out of the envelope and the headers.
 */
export default function adaptRecipients(
  recipients: NodemailerRecipients | undefined
): Address[] {
  if (!recipients) {
    return [];
  }

  return flattenRecipients(recipients)
    .map(adaptSingleRecipient)
    .filter(({ email }) => email);
}

/**
 * Returns the first recipient that has an address, or undefined when there is none, since it is an optional field.
 * Used for `from` and `reply_to` as Mailtrap supports a single address for both.
 */
export function adaptFirstRecipient(
  recipients: NodemailerRecipients | undefined
): Address | undefined {
  const [first] = adaptRecipients(recipients);

  return first;
}
