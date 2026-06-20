import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  basePath: string;
  page: number;
  query?: string;
  totalPages: number;
}

export function Pagination({
  basePath,
  page,
  query,
  totalPages,
}: PaginationProps) {
  function getHref(nextPage: number) {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (nextPage > 1) params.set("page", String(nextPage));

    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  }

  return (
    <nav
      className="flex items-center justify-between gap-4"
      aria-label="Pagination percakapan"
    >
      <p className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button asChild size="sm" variant="outline">
            <Link href={getHref(page - 1)}>
              <ChevronLeft aria-hidden="true" />
              Sebelumnya
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            <ChevronLeft aria-hidden="true" />
            Sebelumnya
          </Button>
        )}
        {page < totalPages ? (
          <Button asChild size="sm" variant="outline">
            <Link href={getHref(page + 1)}>
              Selanjutnya
              <ChevronRight aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            Selanjutnya
            <ChevronRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </nav>
  );
}
