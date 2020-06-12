export const requiredXPToLevel = {
  0: 1,
  45: 2,
  95: 3,
  150: 4,
  210: 5,
  275: 6,
  345: 7,
  420: 8,
  500: 9,
}

export function getLevel(xp) {
  const requiredXP = Object.keys(requiredXPToLevel)
    .map(reqXP => parseInt(reqXP, 10))
    .sort((a, b) => b - a)
    .find(reqXP => xp >= reqXP)
  return requiredXPToLevel[requiredXP]
}
