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
    return { email: recipient };
  }

  return {
    ...(recipient.name !== undefined && { name: recipient.name }),
    email: recipient.address ?? "",
  };
}

/**
 * If there is no recipient, then returns empty array.
 * Otherwise flattens recipients and adopts each one for Mailtrap.
 */
export default function adaptRecipients(
  recipients: NodemailerRecipients | undefined
): Address[] {
  if (!recipients) {
    return [];
  }

  return flattenRecipients(recipients).map(adaptSingleRecipient);
}

/**
 * If there is no recipient or empty array is passed, then return undefined since it is an optional field.
 * Otherwise, if several recipients are given as nodemailer allows, we pick the first one.
 * Used for `from` and `reply_to` as Mailtrap supports a single address for both.
 */
export function adaptFirstRecipient(
  recipients: NodemailerRecipients | undefined
): Address | undefined {
  if (!recipients) {
    return undefined;
  }

  const [first] = flattenRecipients(recipients);

  return first === undefined ? undefined : adaptSingleRecipient(first);
}
