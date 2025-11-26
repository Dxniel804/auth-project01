/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generates a unique slug for a category
 * @param nome The category name
 * @param existingSlugs Array of existing slugs to avoid duplicates
 * @returns A unique slug
 */
export function generateUniqueSlug(nome: string, existingSlugs: string[] = []): string {
  let slug = generateSlug(nome)
  
  // If slug already exists, append a number
  let counter = 1
  let uniqueSlug = slug
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }
  
  return uniqueSlug
}
