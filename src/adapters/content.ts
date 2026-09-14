import { readFileSync } from "node:fs";
import { Readable } from "node:stream";

/**
 * Content as nodemailer accepts it for `text`, `html` and attachments: a string, a Buffer, a readable stream or an object pointing to the content.
 */
export type NodemailerContent = string | Buffer | Readable | ContentObject;

interface ContentObject {
  content?: NodemailerContent | undefined;
  path?: unknown;
}

/**
 * Checks if content type is rather string or buffer, returns content.
 * If content is Readble stream, then calls .read().
 * If content has recursive content property then calls the same function recursively.
 * Otherwise reads file.
 */
export default function adaptContent(
  content: NodemailerContent
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

  return readFileSync(content.path as string);
}
