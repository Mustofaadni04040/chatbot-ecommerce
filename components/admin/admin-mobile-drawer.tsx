"use client";

import { LogOut, Menu, ShieldCheck, Store } from "lucide-react";
import { useState } from "react";

import { logoutAdmin } from "@/app/login/actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AdminMobileDrawer({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Buka menu admin"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <div className="flex h-20 items-center gap-3 border-b px-5 pr-12">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Store className="size-5" aria-hidden="true" />
          </span>
          <div>
            <SheetTitle className="font-semibold tracking-tight">
              AGIA Store
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Admin Panel
            </SheetDescription>
          </div>
        </div>

        <div className="flex-1 py-5">
          <p className="mb-2 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Menu
          </p>
          <AdminNavigation onNavigate={() => setOpen(false)} />
        </div>

        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-sm">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Administrator</p>
              <p className="truncate text-sm font-medium">{email}</p>
            </div>
          </div>
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline" className="w-full">
              <LogOut aria-hidden="true" />
              Logout
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
