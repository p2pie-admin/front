import { useState, useEffect } from "react";

const useSmooth = (value: number) => {
  const [smoothValue, setProgressSmoothValue] = useState(value);
  const initialDifference = value - smoothValue;

  useEffect(() => {
    if (Math.abs(value - smoothValue) > initialDifference * 0.01) {
      setTimeout(
        () => setProgressSmoothValue(smoothValue + (value - smoothValue) / 2),
        10
      );
      return;
    }
    setTimeout(() => setProgressSmoothValue(value), 10);
  }, [value, smoothValue]);
  return smoothValue;
};

export default useSmooth;
