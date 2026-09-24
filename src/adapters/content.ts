import CONFIG from "../config";

import { NodemailerContent } from "../types/transport";

const { ERRORS } = CONFIG;
const { CONTENT_REQUIRED } = ERRORS;

/**
 * Returns the content in the form Mailtrap takes it.
 * Nodemailer resolves every content form it supports into a string or a Buffer before the transport runs, so anything left is not a content we can read: reading it here would bypass options like `disableFileAccess`.
 */
export default function adaptContent(
  content: NodemailerContent | undefined
): string | Buffer {
  if (
    !content ||
    (typeof content !== "string" && !(content instanceof Buffer))
  ) {
    throw new Error(CONTENT_REQUIRED);
  }

  return content;
}
