import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { findRelevantProducts } from "@/app/services/chat-catalog.service";
import {
  ConversationAccessError,
  getOrCreateConversation,
  linkConversationProducts,
} from "@/app/services/conversation.service";
import {
  CATALOG_NOT_FOUND_RESPONSE,
  generateCatalogAnswer,
} from "@/app/services/gemini.service";
import {
  createMessage,
  getRecentMessages,
} from "@/app/services/message.service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SESSION_COOKIE = "agia_chat_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  sessionId?: string,
) {
  const response = NextResponse.json(body, { status });

  if (sessionId) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Body request tidak valid." }, 400);
  }

  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonResponse(
      { error: "Pesan wajib diisi dan maksimal 2000 karakter." },
      400,
    );
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const cookieSession = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  let sessionId =
    cookieSession && uuidPattern.test(cookieSession)
      ? cookieSession
      : randomUUID();
  let shouldSetCookie = sessionId !== cookieSession;

  try {
    const authClient = await createServerSupabaseClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    let conversation;

    try {
      conversation = await getOrCreateConversation(
        sessionId,
        user?.id ?? null,
        parsed.data.message,
      );
    } catch (error) {
      if (!(error instanceof ConversationAccessError)) throw error;

      sessionId = randomUUID();
      shouldSetCookie = true;
      conversation = await getOrCreateConversation(
        sessionId,
        user?.id ?? null,
        parsed.data.message,
      );
    }

    const history = await getRecentMessages(conversation.id);
    await createMessage({
      content: parsed.data.message,
      conversationId: conversation.id,
      role: "user",
    });

    const products = await findRelevantProducts(parsed.data.message);
    let answer = CATALOG_NOT_FOUND_RESPONSE;
    let geminiMetadata: Record<string, unknown> = {};

    if (products.length > 0) {
      const generated = await generateCatalogAnswer({
        history,
        message: parsed.data.message,
        products,
      });
      answer = generated.answer;
      geminiMetadata = generated.metadata;
      await linkConversationProducts(
        conversation.id,
        products.map((product) => product.id),
      );
    }

    await createMessage({
      content: answer,
      conversationId: conversation.id,
      metadata: {
        ...geminiMetadata,
        productIds: products.map((product) => product.id),
      },
      role: "assistant",
    });

    const normalizedAnswer = answer.toLocaleLowerCase("id-ID");
    const referencedProducts = products.filter(
      (product) =>
        normalizedAnswer.includes(product.id.toLocaleLowerCase("id-ID")) ||
        normalizedAnswer.includes(product.name.toLocaleLowerCase("id-ID")),
    );

    return jsonResponse(
      {
        answer,
        conversationId: conversation.id,
        products: referencedProducts.map(({ id, name }) => ({ id, name })),
      },
      200,
      shouldSetCookie ? sessionId : undefined,
    );
  } catch (error) {
    console.error("Chat request failed", error);
    return jsonResponse(
      { error: "Chatbot sedang tidak tersedia. Silakan coba lagi." },
      500,
      shouldSetCookie ? sessionId : undefined,
    );
  }
}
