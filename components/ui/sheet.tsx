"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>,
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetTitle(props: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" {...props} />;
}

function SheetDescription(
  props: React.ComponentProps<typeof SheetPrimitive.Description>,
) {
  return <SheetPrimitive.Description data-slot="sheet-description" {...props} />;
}

function SheetContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-[min(18rem,85vw)] flex-col border-r bg-background shadow-xl duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-5 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Tutup menu</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
};
