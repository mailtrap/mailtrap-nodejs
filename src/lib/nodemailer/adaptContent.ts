import { readFileSync } from "node:fs";
import { Readable } from "node:stream";
import { AttachmentLike } from "nodemailer/lib/mailer";

export default function adaptContent(
  content: string | Buffer | Readable | AttachmentLike
): string | Buffer {
  if (typeof content === "string" || content instanceof Buffer) {
    return content;
  }
  if (content instanceof Readable) {
    return content.read();
  }
  if (content.content) {
    return adaptContent(content.content);
  }
  return readFileSync(content.path);
}
