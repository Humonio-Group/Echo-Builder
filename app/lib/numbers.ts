export const isNumberBetween = (value: number, min: number, max: number, equals: boolean = false) => {
  const aboveMin = equals ? value >= min : value > min;
  const belowMax = equals ? value <= max : value < max;

  return aboveMin && belowMax;
};
