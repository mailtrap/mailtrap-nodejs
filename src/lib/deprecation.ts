const warned = new Set<string>();

/**
 * Emits a `DeprecationWarning` for a renamed API, once per process per old name,
 * so a deprecated call inside a loop warns only the first time.
 */
export default function warnDeprecated(oldName: string, newName: string) {
  if (warned.has(oldName)) return;

  warned.add(oldName);
  process.emitWarning(
    `${oldName} is deprecated and will be removed in a future major release; use ${newName} instead.`,
    { type: "DeprecationWarning", code: "MAILTRAP_DEPRECATED_NAME" }
  );
}
