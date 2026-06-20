import { PackageX } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#f2fff8] via-white to-[#fff7f1] px-5 text-[#17211b]">
      <div className="w-full max-w-lg bg-white px-6 py-14 text-center sm:px-12">
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Produk tidak ditemukan
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#677168]">
          Produk mungkin sudah dihapus atau alamat yang Anda buka tidak tepat.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#225346] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173f35]"
        >
          Lihat semua produk
        </Link>
      </div>
    </main>
  );
}
