import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

        const { chat_id } = await req.json();

        if (!chat_id) {
            throw new Error("chat_id is required");
        }

        const testMessage = `✅ *Test Message Successful!*

🎉 Congratulations! Your Telegram Chat ID is correctly configured.

📻 You will now receive license expiry reminders from MY-Callbook.

Reminder schedule:
• 90 days before expiry
• 60 days before expiry
• 30 days before expiry
• 7 days before expiry
• 1 day before expiry

73 de 9M2PJU 🇲🇾`;

        // Send test message via Telegram Bot API
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chat_id,
                    text: testMessage,
                    parse_mode: "Markdown",
                }),
            }
        );

        const result = await telegramResponse.json();

        if (!result.ok) {
            throw new Error(result.description || "Failed to send message");
        }

        return new Response(
            JSON.stringify({ success: true, message: "Test message sent successfully" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ success: false, error: (error as Error).message }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
