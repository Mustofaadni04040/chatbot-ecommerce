import { ArrowLeft, Bot, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminConversationDetail } from "@/app/services/admin-conversation.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationDetailPageProps {
  params: Promise<{ id: string }>;
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export default async function ConversationDetailPage({
  params,
}: ConversationDetailPageProps) {
  const { id } = await params;

  if (!uuidPattern.test(id)) notFound();

  const detail = await getAdminConversationDetail(id);

  if (!detail) notFound();

  const { conversation, messages } = detail;

  return (
    <section className="space-y-6">
      <Button asChild size="sm" variant="ghost">
        <Link href="/admin/conversations">
          <ArrowLeft aria-hidden="true" />
          Kembali ke percakapan
        </Link>
      </Button>

      <div className="rounded-2xl border bg-background p-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Detail Percakapan
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {conversation.title || "Percakapan tanpa judul"}
        </h1>
        <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p>
            <span className="block text-xs uppercase tracking-wide">Pengguna</span>
            {conversation.user_id ? "User terdaftar" : "Guest"}
          </p>
          <p>
            <span className="block text-xs uppercase tracking-wide">Pesan</span>
            {messages.length} pesan
          </p>
          <p>
            <span className="block text-xs uppercase tracking-wide">
              Chat terakhir
            </span>
            {dateFormatter.format(new Date(conversation.updated_at))}
          </p>
        </div>
        <p className="mt-4 break-all font-mono text-xs text-muted-foreground">
          Session: {conversation.session_id}
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border bg-muted/20 p-4 sm:p-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" && (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="size-4" aria-hidden="true" />
                </span>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                  message.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border bg-background",
                )}
              >
                <p className="whitespace-pre-wrap leading-6">{message.content}</p>
                <time
                  dateTime={message.created_at}
                  className={cn(
                    "mt-2 block text-xs",
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {dateFormatter.format(new Date(message.created_at))}
                </time>
              </div>
              {message.role === "user" && (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
              )}
            </article>
          ))
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Percakapan ini belum memiliki pesan.
          </p>
        )}
      </div>
    </section>
  );
}
