export function defaultAlbumYear(years: number[]): number {
  const currentYear = new Date().getFullYear();
  if (years.includes(currentYear)) return currentYear;
  return years[0];
}

