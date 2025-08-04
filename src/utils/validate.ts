// utils/validate.ts
import { AdminProduct } from '@/types/admin/inventory';

export function isDuplicateSlugOrName(
  products: AdminProduct[],
  slug: string,
  name: string
): boolean {
  return products.some(
    (p) =>
      p.slug?.current === slug || p.name.toLowerCase() === name.toLowerCase()
  );
}
