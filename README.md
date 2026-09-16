# 📚 E-Book Shop (Digital Library)

A modern, responsive web application for browsing, purchasing, and managing digital e-books. Built with **Next.js (App Router)** and powered by **Supabase**.

---

## ✨ Features

- **Storefront**: Browse available e-books with cover images, titles, descriptions, and pricing.
- **Book Details & Checkout**: View detailed book information and complete a purchase securely by providing customer details.
- **Order Management**: Automatic generation of unique Order IDs with initial `PENDING` status.
- **Mock Payment**: Simulated payment gateway with a "Demo Only" banner and a "Simulate Successful Payment" button to update order status to `PAID`.
- **Order Tracking**: Search and track order status anytime using the Order ID or customer email.
- **Digital Delivery**: Simulated secure temporary download links for purchased e-books.

---

## 🛠️ Tech Stack

- **Frontend & Routing**: Next.js (App Router), React, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev