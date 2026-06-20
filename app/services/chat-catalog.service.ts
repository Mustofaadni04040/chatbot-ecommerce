import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ChatProduct } from "@/types/chat";

const STOP_WORDS = new Set([
  "ada",
  "adakah",
  "aku",
  "apa",
  "apakah",
  "barang",
  "bisa",
  "buat",
  "cari",
  "dan",
  "dari",
  "di",
  "ingin",
  "ini",
  "itu",
  "katalog",
  "mau",
  "produk",
  "rekomendasi",
  "saya",
  "tolong",
  "untuk",
  "yang",
]);

const CATALOG_TERMS = ["barang", "katalog", "produk", "rekomendasi"];
const HIGHEST_PRICE_PATTERN =
  /\b(paling mahal|termahal|harga (paling )?tinggi)\b/;
const LOWEST_PRICE_PATTERN =
  /\b(paling murah|termurah|harga (paling )?rendah)\b/;
const HIGHEST_STOCK_PATTERN =
  /\b(stok (paling )?(banyak|tinggi)|stok terbanyak)\b/;
const FOLLOW_UP_PATTERN =
  /\b(berapa|harganya|stoknya|itu|tadi|tersebut|tersedia|warnanya|ukurannya)\b/;

function normalize(value: string) {
  return value
    .toLocaleLowerCase("id-ID")
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function findRelevantProducts(
  message: string,
  limit = 8,
  conversationContext = "",
) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category, price, stock")
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) {
    throw new Error(`Failed to load product catalog: ${error.message}`);
  }

  const products = (data ?? []) as ChatProduct[];
  const normalizedMessage = normalize(message);
  const retrievalMessage =
    conversationContext && FOLLOW_UP_PATTERN.test(normalizedMessage)
      ? normalize(`${conversationContext} ${message}`)
      : normalizedMessage;

  if (HIGHEST_PRICE_PATTERN.test(normalizedMessage)) {
    return products
      .toSorted((a, b) => Number(b.price) - Number(a.price))
      .slice(0, limit);
  }

  if (LOWEST_PRICE_PATTERN.test(normalizedMessage)) {
    return products
      .toSorted((a, b) => Number(a.price) - Number(b.price))
      .slice(0, limit);
  }

  if (HIGHEST_STOCK_PATTERN.test(normalizedMessage)) {
    return products.toSorted((a, b) => b.stock - a.stock).slice(0, limit);
  }

  const terms = retrievalMessage
    .split(" ")
    .filter((term) => term.length > 1 && !STOP_WORDS.has(term));
  const isCatalogRequest = CATALOG_TERMS.some((term) =>
    normalizedMessage.includes(term),
  );

  if (terms.length === 0) {
    return isCatalogRequest ? products.slice(0, limit) : [];
  }

  return products
    .map((product) => {
      const name = normalize(product.name);
      const category = normalize(product.category);
      const description = normalize(product.description);
      const score = terms.reduce((total, term) => {
        if (name.includes(term)) return total + 5;
        if (category.includes(term)) return total + 3;
        if (description.includes(term)) return total + 1;
        return total;
      }, 0);

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);
}
