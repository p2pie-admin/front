export function ifMobile(userAgent: string): boolean {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  return isMobile;
}
