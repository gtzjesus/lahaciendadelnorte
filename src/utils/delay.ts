// utils/delay.ts

/**
 * Delay execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait
 * @returns A Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
