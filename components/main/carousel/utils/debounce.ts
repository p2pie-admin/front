export default function debounce(limit: number, callback: Function) {
  let timeoutId: any;
  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(callback, limit, args);
  };
}
