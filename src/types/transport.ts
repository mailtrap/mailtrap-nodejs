import { Readable } from "node:stream";
import { Url } from "node:url";
import { SendMailOptions, Transport, Transporter } from "nodemailer";
import {
  SendResponse,
  SendError,
  CustomVariables,
  TemplateVariables,
} from "./mailtrap";

/**
 * Address object as nodemailer accepts it. Declared structurally so it matches both the types bundled with nodemailer >= 10 and `@types/nodemailer`.
 */
export type NodemailerAddress = {
  name?: string | undefined;
  address?: string | undefined;
  group?: NodemailerAddress[] | undefined;
};

/**
 * Recipients as nodemailer accepts them: a string, an address object, or an array of these (nested arrays included).
 */
export type NodemailerRecipients =
  | string
  | NodemailerAddress
  | NodemailerRecipients[];

/**
 * Object pointing to a content instead of carrying it.
 */
type NodemailerContentObject = {
  content?: NodemailerContent | undefined;
  path?: string | false | Url | undefined;
};

/**
 * Content as nodemailer accepts it for `text`, `html` and attachments: a string, a Buffer, a readable stream or an object pointing to the content.
 */
export type NodemailerContent =
  | string
  | Buffer
  | Readable
  | NodemailerContentObject;

/**
 * Headers as nodemailer accepts them, derived from the message options so the shape follows whichever nodemailer version is installed.
 */
export type NodemailerHeaders = NonNullable<SendMailOptions["headers"]>;

/**
 * Attachment as nodemailer accepts it, derived from the message options.
 */
export type NodemailerAttachment = NonNullable<
  SendMailOptions["attachments"]
>[number];

type AdditionalFields = {
  category?: string;
  custom_variables?: CustomVariables;
  template_uuid?: string;
  template_variables?: TemplateVariables;
};

export type NormalizeCallbackData =
  | (SendMailOptions & AdditionalFields)
  | undefined;

export type NormalizeCallbackError = Error | null | undefined;

export type NormalizeCallback = (
  err: Error | null,
  info: SendResponse | SendError
) => void;

interface MailtrapMailOptionsSandbox extends SendMailOptions {
  customVariables?: CustomVariables;
  category?: string;
  sandbox: boolean;
}

export interface MailtrapMailOptions extends SendMailOptions {
  customVariables?: CustomVariables;
  category?: string;
  templateUuid?: string;
  templateVariables?: TemplateVariables;
  sandbox?: boolean | undefined;
}

export type MailtrapResponse = SendResponse | SendError;

export interface MailtrapTransporter extends Transporter<MailtrapResponse> {
  sendMail(
    mailOptions: MailtrapMailOptions | MailtrapMailOptionsSandbox,
    callback: (err: Error | null, info: MailtrapResponse) => void
  ): void;
  sendMail(
    mailOptions: MailtrapMailOptions | MailtrapMailOptionsSandbox
  ): Promise<MailtrapResponse>;
}

export type MailMessage<T> = Parameters<Transport<T>["send"]>[0];
