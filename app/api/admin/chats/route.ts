import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function isAdminAuthenticated() {
    const adminPassword =
        process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return false;
    }

    const cookieStore =
        await cookies();

    const session =
        cookieStore.get(
            "admin_session"
        )?.value;

    if (!session) {
        return false;
    }

    const expectedSession =
        createHmac(
            "sha256",
            adminPassword
        )
            .update(
                "admin-session"
            )
            .digest("hex");

    return (
        session ===
        expectedSession
    );
}

export async function GET() {
    const isAuthenticated =
        await isAdminAuthenticated();

    if (!isAuthenticated) {
        return NextResponse.json(
            {
                error:
                    "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    try {
        const {
            data: requests,
            error: requestError,
        } =
            await supabaseAdmin
                .from(
                    "quote_requests"
                )
                .select(
                    `
          id,
          created_at,
          request_note,
          quantity,
          status
          `
                );

        if (requestError) {
            console.error(
                requestError
            );

            return NextResponse.json(
                {
                    error:
                        "요청 조회 실패",
                },
                {
                    status: 500,
                }
            );
        }

        const {
            data: messages,
            error:
            messageError,
        } =
            await supabaseAdmin
                .from(
                    "request_messages"
                )
                .select(
                    `
          id,
          request_id,
          sender,
          message,
          created_at,
          admin_read
          `
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    }
                );

        if (messageError) {
            console.error(
                messageError
            );

            return NextResponse.json(
                {
                    error:
                        "메시지 조회 실패",
                },
                {
                    status: 500,
                }
            );
        }

        const conversations =
            (requests ?? [])
                .map(
                    (request) => {
                        const requestMessages =
                            (
                                messages ??
                                []
                            ).filter(
                                (message) =>
                                    message.request_id ===
                                    request.id
                            );

                        const latestMessage =
                            requestMessages[0] ??
                            null;

                        const unreadCount =
                            requestMessages.filter(
                                (message) =>
                                    message.sender ===
                                    "user" &&
                                    message.admin_read ===
                                    false
                            ).length;

                        return {
                            requestId:
                                request.id,

                            requestNote:
                                request.request_note,

                            quantity:
                                request.quantity,

                            status:
                                request.status,

                            requestCreatedAt:
                                request.created_at,

                            latestMessage:
                                latestMessage
                                    ? {
                                        id:
                                            latestMessage.id,

                                        sender:
                                            latestMessage.sender,

                                        message:
                                            latestMessage.message,

                                        createdAt:
                                            latestMessage.created_at,
                                    }
                                    : null,

                            unreadCount,
                        };
                    }
                )
                // 채팅이 있는 요청만
                .filter(
                    (conversation) =>
                        conversation.latestMessage !==
                        null
                )
                // 최근 메시지 순
                .sort(
                    (a, b) => {
                        const aTime =
                            new Date(
                                a.latestMessage!
                                    .createdAt
                            ).getTime();

                        const bTime =
                            new Date(
                                b.latestMessage!
                                    .createdAt
                            ).getTime();

                        return (
                            bTime -
                            aTime
                        );
                    }
                );

        const totalUnread =
            conversations.reduce(
                (
                    sum,
                    conversation
                ) =>
                    sum +
                    conversation.unreadCount,
                0
            );

        return NextResponse.json(
            {
                conversations,
                totalUnread,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Server error",
            },
            {
                status: 500,
            }
        );
    }
}