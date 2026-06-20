import { PackageX } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] px-5 text-[#17211b]">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#17211b]/10 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(35,48,40,0.08)] sm:px-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#eaf1e9] text-[#315a47]">
          <PackageX className="size-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#a16620]">
          Produk tidak ditemukan
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Produk ini tidak tersedia
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
