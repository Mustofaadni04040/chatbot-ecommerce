import { Eye } from "lucide-react";
import Link from "next/link";

import type { ConversationSummary } from "@/app/services/admin-conversation.service";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

const columns: DataTableColumn<ConversationSummary>[] = [
  {
    header: "Percakapan",
    cell: (conversation) => (
      <div>
        <p className="max-w-sm truncate font-medium">
          {conversation.title || "Percakapan tanpa judul"}
        </p>
        <p className="mt-1 max-w-xs truncate font-mono text-xs text-muted-foreground">
          {conversation.session_id}
        </p>
      </div>
    ),
  },
  {
    header: "Pengguna",
    cell: (conversation) =>
      conversation.user_id ? "User terdaftar" : "Guest",
  },
  {
    header: "Jumlah Pesan",
    cell: (conversation) => `${conversation.message_count} pesan`,
  },
  {
    header: "Chat Terakhir",
    cell: (conversation) => dateFormatter.format(new Date(conversation.updated_at)),
  },
  {
    header: "Aksi",
    className: "text-right",
    cell: (conversation) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/conversations/${conversation.id}`}>
          <Eye aria-hidden="true" />
          Detail
        </Link>
      </Button>
    ),
  },
];

export function ConversationTable({
  conversations,
}: {
  conversations: ConversationSummary[];
}) {
  return (
    <DataTable
      columns={columns}
      getRowKey={(conversation) => conversation.id}
      items={conversations}
    />
  );
}
