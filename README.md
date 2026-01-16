<div align="center">

  <img src="public/icon-512.png" alt="MY-Callbook Logo" width="120" height="auto" />
  
  # 🇲🇾 Malaysian Amateur Radio Callbook
  
  **The Next-Generation Digital Directory for 9M/9W Operators**
  
  [![Live Site](https://img.shields.io/badge/🌐_Access_Directory-callbook.hamradio.my-2563EB?style=for-the-badge)](https://callbook.hamradio.my)
  [![PWA Ready](https://img.shields.io/badge/📱_Install_App-PWA_Ready-00C853?style=for-the-badge&logo=pwa)](https://callbook.hamradio.my)
  [![Donate](https://img.shields.io/badge/❤️_Support_Us-Donate-FF4081?style=for-the-badge)](https://callbook.hamradio.my)

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-self-hosting-docker">Self-Hosting</a> •
    <a href="#-the-zero-cost-philosophy">Philosophy</a>
  </p>

  ![Version](https://img.shields.io/github/v/release/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book?style=flat-square&color=2563EB)
  ![License](https://img.shields.io/github/license/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book?style=flat-square&color=22c55e)
  ![Stars](https://img.shields.io/github/stars/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book?style=flat-square)
  
</div>

---

## 🚀 About The Project

**MY-Callbook** is a modern, high-performance, and community-driven directory for Malaysian Amateur Radio Operators. Built with a "Future-Proof" philosophy, it combines a sleek **Glassmorphism UI** with robust **Offline Capabilities (PWA)** to serve the community indefinitely—for free.

> *"We built this to last forever."* — 9M2PJU

---

## ✨ Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🔍 Intelligent Discovery</h3>
      <ul>
        <li><strong>Instant Search</strong>: Lightning-fast lookups by Callsign, Name, or Location.</li>
        <li><strong>Smart Filters</strong>: Filter by State, Class (A/B/C), or Status.</li>
        <li><strong>Status Badges</strong>: Visual indicators for Active 🟢 and Expired 🔴 licenses.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📱 Mobile First & PWA</h3>
      <ul>
        <li><strong>Installable App</strong>: Add to Home Screen on iOS and Android.</li>
        <li><strong>Offline Ready</strong>: Assets cached for low-connectivity environments.</li>
        <li><strong>Responsive</strong>: Flawless experience on any device size.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🔐 Robust Security</h3>
      <ul>
        <li><strong>Secure Auth</strong>: Powered by Supabase & Cloudflare Turnstile.</li>
        <li><strong>Auto-Protect</strong>: Smart inactivity timeouts (5 mins).</li>
        <li><strong>Privacy Control</strong>: Edit your own data; hide sensitive info.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📡 Operator Tools</h3>
      <ul>
        <li><strong>vCard Export</strong>: 1-click "Save to Contacts".</li>
        <li><strong>Digital Identity</strong>: Link QRZ, DMR, Facebook, and Telegram.</li>
        <li><strong>License Manager</strong>: Track your own expiry dates.</li>
      </ul>
    </td>
  </tr>
</table>

### 🔔 Real-Time Notifications
Experience a living platform with **Live Toasts**:
*   New Operator Registrations
*   Profile Updates
*   User Presence (See who is online)

---

## 🎨 Tech Stack

This project leverages the bleeding edge of modern web development.

<div align="center">

| Frontend | Backend & Data | Infrastructure |
|:---:|:---:|:---:|
| ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |
| ![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |
| ![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white) | ![Edge Functions](https://img.shields.io/badge/Edge_Functions-Deno-white?style=flat-square&logo=deno) | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white) |

</div>

---

## 🏛️ The "Zero-Cost" Philosophy

<details>
<summary><strong>Click to learn how we run this for free forever</strong></summary>

### Sustainability by Design
This project was architected by **9M2PJU** to ensure it never disappears due to lack of funding.

*   **Database**: Supabase Free Tier (500MB). With optimized text-only records, we can store **100,000+ callsigns** (10x our current size) for free.
*   **Hosting**: Vercel Free Tier. Static frontend caching means zero server costs.
*   **Email**: We intentionally **DISABLED** automated email reminders (`EMAIL_ENABLED = false`) to avoid hitting free-tier quotas (100 emails/day) during mass-expiry events.

</details>

<details>
<summary><strong>🔮 The "Dream" Architecture (Future Roadmap)</strong></summary>

If resources were unlimited, here is the vision:
1.  **Global CDN**: Cloudflare Enterprise / AWS CloudFront.
2.  **Dedicated Search**: Meilisearch for typo-tolerant queries.
3.  **Unlimited Storage**: S3/MinIO for high-res QSL card hosting.
4.  **Native Apps**: React Native builds for iOS/Android stores.
5.  **IoT**: API integration for DMR/Digital radios.

</details>

---

## 🐳 Self-Hosting (Docker)

Don't rely on the cloud? Run the **entire stack** (App + DB + Auth + Mail) on your own machine.

```bash
# 1. Clone the repository
git clone https://github.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book.git

# 2. Enter directory
cd 9M2PJU-Malaysian-Amateur-Radio-Call-Book

# 3. Ignite the stack
docker compose up -d
```

- **App**: `http://localhost:3000`
- **Supabase Studio**: `http://localhost:8001`
- **Mailpit**: `http://localhost:8025`

---

## 💝 Support & Donations

This project is a labor of love maintained by volunteers. Your support keeps the lights on and coffee brewing.

<div align="center">
  <a href="https://callbook.hamradio.my">
    <img src="https://img.shields.io/badge/Support_via_QR_Pay-Donate_Now-FF4081?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Donate" />
  </a>
  <p><em>Scan the QR code in the app to contribute via Malaysian Banking/E-Wallet.</em></p>
</div>

---

## 💌 Legacy & Message

> "This project is an initiative by me for all Malaysian Amateur Radio Operators. I hope someone will improve this project later for future generations. Amateur Radio is always the greatest hobby of all."
>
> — **9M2PJU** 🇲🇾

---

<div align="center">

*Maintained with 73*
<br/>
![Altcha](https://img.shields.io/badge/Protected_by-Turnstile-orange?style=flat-square)

</div>
