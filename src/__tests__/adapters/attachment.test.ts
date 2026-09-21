import { Readable } from "stream";
import { readFileSync } from "node:fs";

import adaptAttachment from "../../adapters/attachement";

import config from "../../config";

const { ERRORS } = config;
const { FILENAME_REQUIRED, CONTENT_REQUIRED } = ERRORS;

describe("adapters/attachment: ", () => {
  describe("adaptAttachment(): ", () => {
    it("throws `filename required` error.", () => {
      const attachment = {};

      expect(() => adaptAttachment(attachment)).toThrowError(
        new Error(FILENAME_REQUIRED)
      );
    });

    it("throws `content required` error.", () => {
      const attachment = {
        filename: "mock-filename",
      };

      expect(() => adaptAttachment(attachment)).toThrowError(
        new Error(CONTENT_REQUIRED)
      );
    });

    it("throws `content required` error if adapted content is empty.", () => {
      const emptyStream = new Readable({
        read() {
          this.push(null);
        },
      });

      expect(() =>
        adaptAttachment({ filename: "mock-filename", content: "" })
      ).toThrowError(new Error(CONTENT_REQUIRED));
      expect(() =>
        adaptAttachment({ filename: "mock-filename", content: emptyStream })
      ).toThrowError(new Error(CONTENT_REQUIRED));
    });

    it("returns adapted attachment object in case if content is buffer.", () => {
      const attachment = {
        filename: "mock-filename",
        content: Buffer.from("mock-content"),
      };

      const expectedAttachment = {
        filename: attachment.filename,
        content: attachment.content,
        disposition: undefined,
        content_id: undefined,
        type: undefined,
      };
      const result = adaptAttachment(attachment);

      expect(result).toEqual(expectedAttachment);
    });

    it("returns adapted attachment object in case if content is readable.", () => {
      const content = "mock-content";
      const readableStream = new Readable({
        read() {
          this.push(content);
          this.push(null);
        },
      });

      const attachment = {
        filename: "mock-filename",
        content: readableStream,
      };

      const expectedAttachment = {
        filename: attachment.filename,
        disposition: undefined,
        content_id: undefined,
        type: undefined,
      };
      const result = adaptAttachment(attachment);

      expect(result.filename).toEqual(expectedAttachment.filename);
      expect(result.disposition).toEqual(expectedAttachment.disposition);
      expect(result.content_id).toEqual(expectedAttachment.content_id);
      expect(result.type).toEqual(expectedAttachment.type);
      expect(result.content.toString()).toEqual(content);
    });

    it("returns adapted attachment object.", () => {
      const attachment = {
        filename: "mock-filename",
        content: "mock-content",
      };

      const expectedAttachment = {
        filename: attachment.filename,
        content: attachment.content,
        disposition: undefined,
        content_id: undefined,
        type: undefined,
      };
      const result = adaptAttachment(attachment);

      expect(result).toEqual(expectedAttachment);
    });

    it("returns adapted attachment object in case if content is a content object.", () => {
      const attachment = {
        filename: "mock-filename",
        content: { path: __filename },
      };

      const expectedAttachment = {
        filename: attachment.filename,
        content: readFileSync(__filename),
        disposition: undefined,
        content_id: undefined,
        type: undefined,
      };
      const result = adaptAttachment(attachment);

      expect(result).toEqual(expectedAttachment);
    });
  });
});
