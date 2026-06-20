"use client";

import {
  Bot,
  LoaderCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface WidgetMessage {
  content: string;
  id: string;
  products?: ProductReference[];
  role: "assistant" | "user";
}

interface ProductReference {
  id: string;
  name: string;
}

interface ChatResponse {
  answer?: string;
  error?: string;
  products?: ProductReference[];
}

const initialMessage: WidgetMessage = {
  content:
    "Halo! Saya dapat membantu mencari dan merekomendasikan produk dari katalog AGIA Store.",
  id: "welcome",
  role: "assistant",
};

function MessageContent({
  content,
  products = [],
}: {
  content: string;
  products?: ProductReference[];
}) {
  const cleanContent = content
    .replace(/\s*[-:]?\s*\/products\/[0-9a-z-]+/gi, "")
    .trim();

  return (
    <>
      {cleanContent}
      {products.length > 0 && (
        <div className="mt-2 flex flex-col items-start gap-1.5">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="font-semibold underline decoration-current/40 underline-offset-2 hover:decoration-current"
            >
              Lihat {product.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1.5"
      role="status"
      aria-label="Asisten sedang mengetik"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-2 animate-bounce rounded-full bg-[#537565]"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

export function ChatWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<WidgetMessage[]>([initialMessage]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isLoading, isOpen, messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();

    if (!message || isLoading) return;

    setMessages((current) => [
      ...current,
      { content: message, id: crypto.randomUUID(), role: "user" },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as ChatResponse;

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "Respons chatbot tidak valid.");
      }

      setMessages((current) => [
        ...current,
        {
          content: data.answer as string,
          id: crypto.randomUUID(),
          products: data.products,
          role: "assistant",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          content: "Maaf, chatbot sedang tidak tersedia. Silakan coba lagi.",
          id: crypto.randomUUID(),
          role: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          id="chat-widget-panel"
          role="dialog"
          aria-label="Chat dengan asisten produk"
          className="fixed inset-x-3 bottom-3 flex h-[min(42rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-3xl border border-[#4e9f8b]/15 bg-white shadow-[0_24px_80px_rgba(23,63,53,0.24)] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[36rem] sm:w-[24rem]"
        >
          <header className="flex shrink-0 items-center justify-between bg-[#4e9f8b] px-4 py-3.5 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/12">
                <Bot className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">Asisten AGIA</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Asisten katalog produk
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Tutup chatbot"
              onClick={() => setIsOpen(false)}
              className="rounded-full cursor-pointer text-white hover:bg-white/15 hover:text-white"
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </header>

          <div
            className="flex-1 space-y-4 overflow-y-auto bg-[#f7f8f4] p-4"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm",
                    message.role === "user"
                      ? "rounded-br-md bg-[#4e9f8b] text-white"
                      : "rounded-bl-md border border-[#4e9f8b]/8 bg-white text-[#34443a]",
                  )}
                >
                  <MessageContent
                    content={message.content}
                    products={message.products}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-[#4e9f8b]/8 bg-white px-4 py-3 shadow-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 items-end gap-2 border-t border-[#4e9f8b]/10 bg-white p-3"
          >
            <label htmlFor="chat-message" className="sr-only">
              Tulis pesan
            </label>
            <Textarea
              ref={inputRef}
              id="chat-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Cari produk..."
              maxLength={2000}
              rows={1}
              disabled={isLoading}
              className="max-h-28 min-h-11 resize-none rounded-2xl border-[#4e9f8b]/15 py-2.5 focus-visible:border-[#4e9f8b] focus-visible:ring-[#4e9f8b]/10"
            />
            <Button
              type="submit"
              size="icon-lg"
              disabled={!input.trim() || isLoading}
              aria-label={isLoading ? "Mengirim pesan" : "Kirim pesan"}
              className="size-11 shrink-0 rounded-full cursor-pointer bg-[#4e9f8b] text-white hover:bg-[#225346]"
            >
              {isLoading ? (
                <LoaderCircle
                  className="size-5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Send className="size-5" aria-hidden="true" />
              )}
            </Button>
          </form>
        </section>
      )}

      {!isOpen && (
        <Button
          type="button"
          size="icon-lg"
          aria-label="Buka chatbot"
          aria-controls="chat-widget-panel"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="size-14 rounded-full cursor-pointer bg-[#4e9f8b] text-white shadow-[0_12px_35px_rgba(23,63,53,0.35)] hover:bg-[#58b69d] sm:size-16"
        >
          <Bot className="size-6 sm:size-7" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
