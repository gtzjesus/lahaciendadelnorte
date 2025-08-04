// utils/slugify.ts

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple dashes with one
    .replace(/^-+/, '') // Trim leading -
    .replace(/-+$/, ''); // Trim trailing -
}
