/**
 * Сonverts the date to the UTC format.
 *
 * @param {number | string | Date} dt Passed date.
 * @return {number} The number of milliseconds between a specified date and midnight of January 1, 1970, according to UTC.
 */
export const convertToUTC = (dt: number | string | Date): number => {
  const date = new Date(dt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return Date.UTC(year, month, day);
};
