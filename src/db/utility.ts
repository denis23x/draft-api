/** @format */

export const setDate = (subtract: number): string => {
  const date = new Date();

  date.setDate(date.getDate() - subtract);

  return date.toISOString().slice(0, 19).replace('T', ' ');
};
