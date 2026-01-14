# License Reminder Edge Function

This Supabase Edge Function sends automated email reminders to users when their amateur radio license is about to expire.

## Features

- Sends reminders at **90, 60, 30, 14, 7, 3, and 1 days** before expiry
- Beautiful HTML email template with urgency indicators
- Tracks sent reminders to avoid duplicates
- Uses Resend for reliable email delivery

## Setup Instructions

### 1. Run the SQL Setup

Execute `license-reminders-setup.sql` in Supabase SQL Editor to create the tracking table.

### 2. Add Resend API Key

```bash
# Using Supabase CLI
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Or via Dashboard: Project Settings → Edge Functions → Secrets
```

### 3. Deploy the Function

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy license-reminder
```

### 4. Set Up Cron Schedule

In Supabase Dashboard:
1. Go to **Edge Functions** → **license-reminder**
2. Click **Schedule**
3. Add cron expression: `0 0 * * *` (runs daily at midnight UTC / 8 AM MYT)

### 5. Test the Function

```bash
# Invoke manually to test
supabase functions invoke license-reminder
```

## Email Configuration

- **From**: MY-Callbook <MY-Callbook@callbook.hamradio.my>
- **Reminder intervals**: 90, 60, 30, 14, 7, 3, 1 days before expiry

## Monitoring

Check Edge Function logs in Supabase Dashboard:
- **Edge Functions** → **license-reminder** → **Logs**

Check Resend dashboard for email delivery stats:
- https://resend.com/emails
