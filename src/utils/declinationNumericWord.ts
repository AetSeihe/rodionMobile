export const declinationNumericWord = (
  value: number,
  words: [string, string, string],
): string => {
  if (value === 1) {
    return words[0];
  }

  if (value <= 5) {
    return words[1];
  }

  return words[2];
};
