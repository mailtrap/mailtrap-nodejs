import { Readable } from "stream";

import adaptContent from "../../adapters/content";

import config from "../../config";

const { ERRORS } = config;
const { CONTENT_REQUIRED } = ERRORS;

describe("adapters/content: ", () => {
  describe("adaptContent(): ", () => {
    it("returns content if type is string", () => {
      const content = "mock-content";

      const result = adaptContent(content);

      expect(result).toBe(content);
    });

    it("returns content if it is instance of buffer", () => {
      const content = Buffer.from("mock-content");

      const result = adaptContent(content);

      expect(result).toBe(content);
    });

    it("throws `content required` error for content nodemailer did not resolve.", () => {
      const readableStream = new Readable({
        read() {
          this.push("mock-content");
          this.push(null);
        },
      });

      const unresolvedContents = [
        undefined,
        "",
        readableStream,
        { path: __filename },
        { content: "mock-content" },
        { content: { path: __filename } },
        { content: { content: { path: __filename } } },
      ];

      unresolvedContents.forEach((content) => {
        expect(() => adaptContent(content)).toThrowError(
          new Error(CONTENT_REQUIRED)
        );
      });
    });
  });
});
