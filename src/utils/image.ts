/**
 * Generates the correct image URL for pet photos using the API pattern
 * @param photoPath - The photo_path from the API response
 * @returns The complete image URL or null if no photo path
 */
export const getPetImageUrl = (photoPath: string | null): string | null => {
  if (!photoPath) {
    return null;
  }
  const imageUrl = `https://api.neodog.app/api/storage/${photoPath}`;
  return imageUrl;
};
