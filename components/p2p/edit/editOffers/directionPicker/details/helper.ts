export const getSuggestedRate = ({
  googleRate,
  bestRate,
}: {
  googleRate?: number;
  bestRate?: number;
}) => {
  if (!googleRate && !bestRate) return;

  if (!bestRate) return googleRate;
  if (!googleRate || differMoreThan10Percent(googleRate, bestRate))
    return bestRate;

  const average = (googleRate + bestRate) / 2;
  return (
    average + (Math.max(Math.abs(bestRate), Math.abs(googleRate)) - average) / 2
  );
};

const differMoreThan10Percent = (a: number, b: number) =>
  Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)) > 0.1;
