# Telegram Bot Webhook

Handles incoming messages to @MYHamRadioCallbookBot and responds with the user's Chat ID.

## How It Works

1. User messages the bot (or sends `/start`)
2. Bot automatically replies with their Chat ID
3. User copies the ID to their MY-Callbook profile

## Setup

### 1. Deploy the Function
```bash
supabase functions deploy telegram-bot
```

Or via Dashboard: Edge Functions → New Function → `telegram-bot`

### 2. Set Telegram Webhook
After deploying, set your bot's webhook URL:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://cyhvmzreenhvxiwuqahb.supabase.co/functions/v1/telegram-bot"
```

Replace `<YOUR_BOT_TOKEN>` with your actual bot token.

### 3. Verify Webhook
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

## Environment Variables

Uses the same `TELEGRAM_BOT_TOKEN` secret as the license-reminder function.
