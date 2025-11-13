import axios, { AxiosError } from "axios";

import MailtrapError from "./MailtrapError";

import { AxiosErrorObject } from "../types/axios";

/**
 * Axios error names guard.
 */
const hasErrorProperty = <T extends keyof AxiosErrorObject>(
  obj: unknown,
  propertyName: T
): obj is AxiosErrorObject => {
  return (obj as AxiosErrorObject)?.[propertyName] !== undefined;
};

/**
 * Formats a single field error message.
 */
function formatFieldError(field: string, fieldErrors: unknown[]): string {
  const messages = fieldErrors.map((err) => String(err)).join(", ");

  return field === "base" ? messages : `${field}: ${messages}`;
}

/**
 * Extracts and formats field errors from an error object.
 */
function extractFieldErrors(errorsObj: Record<string, unknown>): string[] {
  return Object.entries(errorsObj)
    .filter(([, fieldErrors]) => Array.isArray(fieldErrors))
    .map(([field, fieldErrors]) =>
      formatFieldError(field, fieldErrors as unknown[])
    )
    .filter((msg) => msg.length > 0);
}

/**
 * Gets identifier (email or id) from an error object.
 */
function getErrorIdentifier(errorObj: Record<string, unknown>): string {
  return (errorObj.email || errorObj.id || "") as string;
}

/**
 * Extracts errors from nested "errors" property.
 */
function extractNestedErrors(
  errorObj: Record<string, unknown>
): string[] | null {
  if (
    errorObj.errors &&
    typeof errorObj.errors === "object" &&
    !Array.isArray(errorObj.errors)
  ) {
    return extractFieldErrors(errorObj.errors as Record<string, unknown>);
  }

  return null;
}

/**
 * Extracts errors directly from object properties (excluding identifiers).
 */
function extractDirectErrors(errorObj: Record<string, unknown>): string[] {
  const directErrors = Object.entries(errorObj)
    .filter(
      ([field]) => field !== "email" && field !== "id" && field !== "errors"
    )
    .reduce((acc, [field, value]) => {
      acc[field] = value;
      return acc;
    }, {} as Record<string, unknown>);

  return extractFieldErrors(directErrors);
}

/**
 * Formats a single error object into a message string.
 */
function formatErrorMessage(errorObj: Record<string, unknown>): string | null {
  const identifier = getErrorIdentifier(errorObj);
  const itemMessages =
    extractNestedErrors(errorObj) || extractDirectErrors(errorObj);

  if (itemMessages.length > 0) {
    const formattedMessage = itemMessages.join("; ");
    return identifier ? `${identifier}: ${formattedMessage}` : formattedMessage;
  }

  if (identifier) {
    return String(identifier);
  }

  return null;
}

/**
 * Extracts error messages from an array of error objects.
 * Each object may have nested errors with field-specific messages.
 */
function extractMessagesFromErrorObjects(
  errorObjects: Array<Record<string, unknown>>
): string {
  const messages = errorObjects
    .map(formatErrorMessage)
    .filter((msg): msg is string => msg !== null);

  return messages.join(" | ");
}

/**
 * Extracts error message from server response data.
 */
function extractErrorMessage(data: unknown, defaultMessage: string): string {
  // Preserve plain-text error responses
  if (typeof data === "string") {
    return data;
  }

  // Convert other non-object types to string
  if (data && typeof data !== "object") {
    return String(data);
  }

  // Fall back to default message for null/undefined or non-objects
  if (data === null || data === undefined || typeof data !== "object") {
    return defaultMessage;
  }

  // error is in `data.error`
  if ("error" in data && data.error) {
    return String(data.error);
  }

  // errors are in `data.errors`
  if ("errors" in data && data.errors) {
    const { errors } = data;

    // errors is a string
    if (typeof errors === "string") {
      return errors;
    }

    // errors is an array of strings
    if (Array.isArray(errors) && errors.length > 0) {
      if (typeof errors[0] === "string") {
        return errors.join(",");
      }

      // errors is an array of objects
      if (typeof errors[0] === "object" && errors[0] !== null) {
        const extracted = extractMessagesFromErrorObjects(
          errors as Array<Record<string, unknown>>
        );
        if (extracted) {
          return extracted;
        }
      }
    }

    // errors is an object (could have name/base or field-specific errors)
    if (
      typeof errors === "object" &&
      !Array.isArray(errors) &&
      errors !== null
    ) {
      // check for name/base properties first (legacy format)
      const errorNames =
        hasErrorProperty(errors, "name") && errors.name.join(", ");
      const errorBase =
        hasErrorProperty(errors, "base") && errors.base.join(", ");

      if (errorNames) return errorNames;
      if (errorBase) return errorBase;

      // extract field-specific errors (e.g., { "email": ["is invalid", ...] })
      const fieldMessages = extractFieldErrors(
        errors as Record<string, unknown>
      );

      if (fieldMessages.length > 0) {
        return fieldMessages.join("; ");
      }

      // If errors object doesn't match any recognized pattern, fall back to default message
      return defaultMessage;
    }

    // If errors doesn't match any recognized format, fall back to default message
    return defaultMessage;
  }

  return defaultMessage;
}

/**
 * Extracts error message from axios error.
 * Context information (status code, URL, etc.) is available in error.cause.
 */
function buildErrorMessage(error: AxiosError): string {
  const primaryMessage = error.response?.data
    ? extractErrorMessage(error.response.data, error.message)
    : error.message;

  return primaryMessage;
}

/**
 * Error handler for axios response.
 */
export default function handleSendingError(error: AxiosError | unknown) {
  if (axios.isAxiosError(error)) {
    const message = buildErrorMessage(error);

    // @ts-expect-error weird typing around Error class, but it's tested to work
    throw new MailtrapError(message, { cause: error });
  }

  throw error; // should not happen, but otherwise rethrow error as is
}
