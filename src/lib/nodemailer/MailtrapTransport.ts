import { Transport } from "nodemailer";
import MailMessage from "nodemailer/lib/mailer/mail-message";

import packageData from "../../../package.json";
import { MailtrapClient } from "../..";
import { MailtrapClientConfig, SendError, SendResponse } from "../types";
import adaptMessage from "./adaptMessage";

// eslint-disable-next-line import/prefer-default-export
export default class MailtrapTransport
  implements Transport<SendResponse | SendError>
{
  name: string;

  version: string;

  private client: MailtrapClient;

  constructor(options: MailtrapClientConfig) {
    this.name = "MailtrapTransport";
    this.version = packageData.version;
    this.client = new MailtrapClient(options);
  }

  send(
    nodemailerMessage: MailMessage<SendResponse>,
    callback: (err: Error | null, info?: SendResponse) => void
  ) {
    nodemailerMessage.normalize((err, data) => {
      if (err) {
        setImmediate(() => callback(err));
      }
      const mail = adaptMessage(data);
      if ("errors" in mail) {
        setTimeout(() => callback(new Error("mail is invalid"), mail), 0);
        return;
      }

      this.client.send(mail).then(
        (sendResponse) => callback(null, sendResponse),
        (sendError: SendError) =>
          callback(new Error("sending failed"), sendError)
      );
    });
  }
}
