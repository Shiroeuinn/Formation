export function isOldEnough(value: number): boolean {
  return value <= new Date().getFullYear() - 18;
}
