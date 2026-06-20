"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormState } from "@/app/admin/products/actions";
import type { ProductRow } from "@/types";

interface ProductFormProps {
  action: (
    state: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  initialProduct?: ProductRow;
  submitLabel: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving..." : label}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

export function ProductForm({
  action,
  initialProduct,
  submitLabel,
}: ProductFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            defaultValue={initialProduct?.name}
            id="name"
            name="name"
            placeholder="Product name"
            required
          />
          <FieldError message={state.errors?.name?.[0]} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            defaultValue={initialProduct?.category}
            id="category"
            name="category"
            placeholder="Category"
            required
          />
          <FieldError message={state.errors?.category?.[0]} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          defaultValue={initialProduct?.description}
          id="description"
          name="description"
          placeholder="Describe the product"
          required
        />
        <FieldError message={state.errors?.description?.[0]} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            defaultValue={initialProduct?.price}
            id="price"
            min="0"
            name="price"
            placeholder="0"
            required
            step="0.01"
            type="number"
          />
          <FieldError message={state.errors?.price?.[0]} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            defaultValue={initialProduct?.stock}
            id="stock"
            min="0"
            name="stock"
            placeholder="0"
            required
            step="1"
            type="number"
          />
          <FieldError message={state.errors?.stock?.[0]} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          defaultValue={initialProduct?.image_url ?? ""}
          id="image_url"
          name="image_url"
          placeholder="https://example.com/product.jpg"
          type="url"
        />
        <FieldError message={state.errors?.image_url?.[0]} />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} />
        <Button asChild type="button" variant="outline">
          <a href="/admin/products">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
