import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramUpdate {
    message?: {
        chat: {
            id: number;
            first_name?: string;
            username?: string;
        };
        text?: string;
        from?: {
            first_name?: string;
            username?: string;
        };
    };
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

        if (!telegramBotToken) {
            throw new Error("TELEGRAM_BOT_TOKEN not configured");
        }

        const update: TelegramUpdate = await req.json();

        // Only process messages
        if (!update.message) {
            return new Response(JSON.stringify({ ok: true }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const chatId = update.message.chat.id;
        const text = update.message.text || "";
        const firstName = update.message.from?.first_name || "there";

        let responseMessage: string;

        if (text === "/start" || text.toLowerCase().includes("id")) {
            // User wants their Chat ID
            responseMessage = `👋 *Welcome to MY-Callbook Reminder Bot!*

Hello ${firstName}! Here's your information:

📋 *Your Chat ID:* \`${chatId}\`

📝 *How to use:*
1. Copy the Chat ID above
2. Go to [MY-Callbook](https://callbook.hamradio.my)
3. Edit your callsign profile
4. Paste your Chat ID in the "Telegram Chat ID" field
5. Save your profile

✅ Once done, you'll receive license expiry reminders at:
• 90 days before expiry
• 60 days before expiry
• 30 days before expiry
• 7 days before expiry
• 1 day before expiry

📻 73 de 9M2PJU`;
        } else {
            // Default response for any other message
            responseMessage = `📋 *Your Telegram Chat ID is:*

\`${chatId}\`

Copy this number and paste it in your MY-Callbook profile to receive license expiry reminders!

🔗 [Go to MY-Callbook](https://callbook.hamradio.my)`;
        }

        // Send response via Telegram Bot API
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: responseMessage,
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                }),
            }
        );

        const result = await telegramResponse.json();

        return new Response(JSON.stringify({ ok: true, result }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            {
                status: 200, // Telegram expects 200 even on errors
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
