import { Readable } from "stream";

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

    it("throws `content required` error for content nodemailer did not resolve.", () => {
      const readableStream = new Readable({
        read() {
          this.push("mock-content");
          this.push(null);
        },
      });

      const unresolvedContents = [
        "",
        readableStream,
        { path: __filename },
        { content: { path: __filename } },
        { filename: "mock-filename", content: "", contentType: "text/plain" },
      ];

      unresolvedContents.forEach((content) => {
        expect(() =>
          adaptAttachment({ filename: "mock-filename", content })
        ).toThrowError(new Error(CONTENT_REQUIRED));
      });
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
  });
});
