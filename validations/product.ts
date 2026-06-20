import { z } from "zod";

const currencySchema = z.coerce
  .number()
  .min(0, "Price must be 0 or greater")
  .finite("Price must be a valid number");

const stockSchema = z.coerce
  .number()
  .int("Stock must be a whole number")
  .min(0, "Stock must be 0 or greater");

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().min(1, "Description is required").max(1000),
  price: currencySchema,
  category: z.string().trim().min(1, "Category is required").max(80),
  stock: stockSchema,
  image_url: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function parseProductFormData(formData: FormData) {
  return productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    stock: formData.get("stock"),
    image_url: formData.get("image_url"),
  });
}
