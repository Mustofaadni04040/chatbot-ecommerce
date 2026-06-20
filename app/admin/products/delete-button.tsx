"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function DeleteProductButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} size="sm" type="submit" variant="destructive">
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
