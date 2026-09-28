import MailtrapClient from "./MailtrapClient";

import adaptMail from "../adapters/mail";

import CONFIG from "../config";

import { Mail as MailtrapMail, SendError } from "../types/mailtrap";
import {
  NormalizeCallbackData,
  NormalizeCallbackError,
  NormalizeCallback,
} from "../types/transport";

const { ERRORS } = CONFIG;
const { SENDING_FAILED, NO_DATA_ERROR } = ERRORS;

/**
 * Adapts the mail, turning an error thrown by an adapter into a `SendError`.
 * The callback runs inside `Nodemailer`, which doesn't catch it, so a throw would crash the process instead of rejecting the `sendMail` promise.
 */
function adaptMailSafely(
  data: NonNullable<NormalizeCallbackData>
): MailtrapMail | SendError {
  try {
    return adaptMail(data);
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Callback function for `Nodemailer.normalize` method which introduces Mailtrap integration.
 * Uses function curring to inject dependencies like `transport client` and `nodemailer default callback object`.
 */
export default function normalizeCallback(
  client: MailtrapClient,
  callback: NormalizeCallback
) {
  return (err: NormalizeCallbackError, data: NormalizeCallbackData) => {
    if (err) {
      return callback(err, { success: false, errors: [err.message] });
    }

    if (data) {
      const mail = adaptMailSafely(data);

      if ("errors" in mail) {
        return callback(new Error(...mail.errors), {
          success: false,
          errors: mail.errors,
        });
      }

      return client
        .send(mail as MailtrapMail)
        .then((sendResponse) => callback(null, sendResponse))
        .catch((error: any) => {
          callback(new Error(error), {
            success: false,
            errors: [SENDING_FAILED],
          });
        });
    }

    return callback(new Error(NO_DATA_ERROR), {
      success: false,
      errors: [NO_DATA_ERROR],
    });
  };
}
