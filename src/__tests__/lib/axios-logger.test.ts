import { AxiosError } from "axios";
import axiosLogger from "../../lib/axios-logger";
import MailtrapError from "../../lib/MailtrapError";

describe("lib/axios-logger: ", () => {
  describe("handleSendingError(): ", () => {
    it("re-throws error if it's not axios error.", () => {
      const unknownError = new Error("mock-error");

      expect.assertions(1);

      try {
        axiosLogger(unknownError);
      } catch (error) {
        expect(error).toBe(unknownError);
      }
    });

    it("should throw error with given message, if error is axios one.", () => {
      const unknownError = new AxiosError("mock-error");

      expect.assertions(2);

      try {
        axiosLogger(unknownError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toBe(unknownError.message);
        }
      }
    });

    it("should throw MailtrapError with given message, if error is axios one.", () => {
      const response = {};
      // @ts-ignore
      const unknownError = new AxiosError("message", "400", {}, response);

      expect.assertions(2);

      try {
        axiosLogger(unknownError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toBe(unknownError.message);
        }
      }
    });

    it("extracts single error string from response data", () => {
      const responseData = { error: "Not Found" };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "404",
        { headers: {} } as any,
        {
          data: responseData,
          status: 404,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 404,
        statusText: "Not Found",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Not Found");
        }
      }
    });

    it("extracts array of error strings from response data", () => {
      const responseData = {
        success: false,
        errors: [
          "'subject' is required",
          "must specify either text or html body",
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "400",
        { headers: {} } as any,
        {
          data: responseData,
          status: 400,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe(
            "'subject' is required,must specify either text or html body"
          );
        }
      }
    });

    it("extracts errors from array of error objects with nested errors", () => {
      const responseData = {
        errors: [
          {
            email: "invalid-email-1",
            errors: {
              email: ["is invalid", "is required"],
            },
          },
          {
            email: "invalid-email-2",
            errors: {
              base: ["Contact limit exceeded"],
            },
          },
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe(
            "invalid-email-1: email: is invalid, is required | invalid-email-2: Contact limit exceeded"
          );
        }
      }
    });

    it("extracts errors from array of error objects with direct base field", () => {
      const responseData = {
        errors: [
          {
            base: ["contacts are required"],
          },
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("contacts are required");
        }
      }
    });

    it("extracts errors from object with name property", () => {
      const responseData = {
        errors: {
          name: ["can't be blank", "is too short"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("can't be blank, is too short");
        }
      }
    });

    it("extracts errors from object with base property", () => {
      const responseData = {
        errors: {
          base: ["Something went wrong"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Something went wrong");
        }
      }
    });

    it("extracts errors from object with field-specific errors", () => {
      const responseData = {
        errors: {
          email: ["is invalid", "top level domain is too short"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe(
            "email: is invalid, top level domain is too short"
          );
        }
      }
    });

    it("handles error object with multiple field errors", () => {
      const responseData = {
        errors: {
          email: ["is invalid"],
          phone: ["can't be blank"],
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(3);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toContain("email: is invalid");
          expect(error.message).toContain("phone: can't be blank");
        }
      }
    });

    it("falls back to default message when response data is invalid", () => {
      const responseData = null;
      // @ts-ignore
      const axiosError = new AxiosError(
        "Network error",
        "500",
        { headers: {} } as any,
        {
          data: responseData,
          status: 500,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Network error");
        }
      }
    });

    it("preserves cause property with original axios error", () => {
      const responseData = { error: "Not Found" };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "404",
        { headers: {} } as any,
        {
          data: responseData,
          status: 404,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 404,
        statusText: "Not Found",
        headers: {},
        config: {} as any,
      };

      expect.assertions(3);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause).toBe(axiosError);
          expect(error.message).toBe("Not Found");
        }
      }
    });

    it("returns identifier when error object has no messages but has identifier", () => {
      const responseData = {
        errors: [
          {
            email: "test@example.com",
            // No errors property, just identifier
          },
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("test@example.com");
        }
      }
    });

    it("preserves plain-text error responses", () => {
      const responseData = "Plain text error message";
      // @ts-ignore
      const axiosError = new AxiosError(
        "Network error",
        "500",
        { headers: {} } as any,
        {
          data: responseData,
          status: 500,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          // Plain-text responses should be preserved
          expect(error.message).toBe("Plain text error message");
        }
      }
    });

    it("converts non-object, non-string data to string", () => {
      const responseData = 404;
      // @ts-ignore
      const axiosError = new AxiosError(
        "Network error",
        "500",
        { headers: {} } as any,
        {
          data: responseData,
          status: 500,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          // Non-object types should be converted to string
          expect(error.message).toBe("404");
        }
      }
    });

    it("returns default message when data is null", () => {
      const responseData = null;
      // @ts-ignore
      const axiosError = new AxiosError(
        "Network error",
        "500",
        { headers: {} } as any,
        {
          data: responseData,
          status: 500,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Network error");
        }
      }
    });

    it("returns default message when response data has no error or errors", () => {
      const responseData = { success: true };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "200",
        { headers: {} } as any,
        {
          data: responseData,
          status: 200,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("Request failed");
        }
      }
    });

    it("handles error object with no identifier and no messages", () => {
      const responseData = {
        errors: [
          {
            // No email, no id, no errors property, and someOtherField is not an array
            someOtherField: "value",
          },
        ],
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          // When all error objects return null, extractMessagesFromErrorObjects returns empty string ""
          // Empty string is falsy, so if (extracted) fails and falls through to default message
          expect(error.message).toBe("Request failed");
        }
      }
    });

    it("handles errors object that doesn't match any pattern", () => {
      const responseData = {
        errors: {
          // Not name/base, and not an array of field errors
          someField: "not an array",
        },
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          // Should fall back to default error message when errors shape is unrecognized
          expect(error.message).toBe("Request failed");
        }
      }
    });

    it("handles errors as non-array, non-object value", () => {
      const responseData = {
        errors: "string error",
      };
      // @ts-ignore
      const axiosError = new AxiosError(
        "Request failed",
        "422",
        { headers: {} } as any,
        {
          data: responseData,
          status: 422,
        }
      );
      axiosError.response = {
        data: responseData,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      };

      expect.assertions(2);

      try {
        axiosLogger(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe("string error");
        }
      }
    });
  });
});
