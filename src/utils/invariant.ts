export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    const error = new Error(message);
    throw error;
  }
}
