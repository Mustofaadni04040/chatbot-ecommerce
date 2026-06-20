"use client";

import {
  LayoutDashboard,
  MessageSquareText,
  PackageSearch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/admin/products",
    icon: PackageSearch,
    label: "Produk",
  },
  {
    href: "/admin/conversations",
    icon: MessageSquareText,
    label: "Percakapan",
  },
];

export function AdminNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi admin"
      className={cn(
        mobile
          ? "flex gap-2 overflow-x-auto px-4 pb-3"
          : "flex flex-col gap-1.5 px-3",
      )}
    >
      {navigationItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              mobile ? "shrink-0 px-3 py-2" : "px-3 py-2.5",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
