import { MessageSquareText, Search } from "lucide-react";

import { getAdminConversations } from "@/app/services/admin-conversation.service";
import { Pagination } from "@/components/admin/pagination";
import { ConversationTable } from "@/components/conversation/conversation-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

interface ConversationsPageProps {
  searchParams: Promise<{
    page?: string | string[];
    q?: string | string[];
  }>;
}

function getStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function ConversationsPage({
  searchParams,
}: ConversationsPageProps) {
  const params = await searchParams;
  const search = getStringParam(params.q).slice(0, 100);
  const requestedPage = Number.parseInt(getStringParam(params.page), 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const { conversations, total } = await getAdminConversations({
    page,
    pageSize: PAGE_SIZE,
    search,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Rekap Chatbot
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Percakapan
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {total} percakapan tersimpan
        </p>
      </div>

      <form action="/admin/conversations" className="flex gap-2" role="search">
        <div className="relative max-w-xl flex-1">
          <label htmlFor="conversation-search" className="sr-only">
            Cari percakapan
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="conversation-search"
            name="q"
            type="search"
            defaultValue={search}
            placeholder="Cari judul, session ID, atau isi pesan..."
            className="pl-9"
          />
        </div>
        <Button type="submit">Cari</Button>
      </form>

      {conversations.length > 0 ? (
        <ConversationTable conversations={conversations} />
      ) : (
        <div className="rounded-2xl border border-dashed bg-background px-6 py-14 text-center">
          <MessageSquareText
            className="mx-auto size-9 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="mt-4 font-semibold">
            {search ? "Percakapan tidak ditemukan" : "Belum ada percakapan"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {search
              ? "Coba gunakan judul atau session ID yang berbeda."
              : "Percakapan chatbot akan tampil di halaman ini."}
          </p>
        </div>
      )}

      <Pagination
        basePath="/admin/conversations"
        page={Math.min(page, totalPages)}
        query={search}
        totalPages={totalPages}
      />
    </section>
  );
}
