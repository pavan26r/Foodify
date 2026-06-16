# 🍔 Foodify — Video-Based Food Discovery & Ordering Platform

> **See it. Crave it. Order it.**
> Foodify lets vendors upload real dish videos so customers can watch, explore, and order food with complete confidence — no surprises, no guesswork.

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-foodify--frontend--ten.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://foodify-frontend-ten.vercel.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-76.6%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/pavan26r/Foodify)
[![CSS](https://img.shields.io/badge/CSS-23%25-1572B6?style=for-the-badge&logo=css3)](https://github.com/pavan26r/Foodify)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🍽️ About the Project

**Foodify (FoodPartner)** is a next-generation food discovery platform that bridges the gap between restaurants and customers through **real dish videos**. Instead of relying on stock photos or text descriptions, vendors upload short videos of their actual dishes — so what you see is what you get.

### 🎯 Core Idea
- Vendors upload authentic dish videos directly from their kitchen
- Customers browse stores, watch dish previews, and order with full transparency
- Promotes **trust**, **visual authenticity**, and **confidence** before ordering

---

## ✨ Features

### 👨‍🍳 For Vendors
- Register your store and upload real dish videos
- Manage your menu, pricing, and availability
- View and fulfill incoming orders from a dedicated dashboard
- Build trust with customers through authentic visual content

### 🛍️ For Customers
- Browse local restaurants and food stores online
- Watch actual dish videos before placing an order
- Smooth ordering experience with cart and checkout flow
- Order confidently — no more misleading food photos

### ⚙️ Platform
- JWT-based authentication for both vendors and customers
- Role-based access control (Vendor / Customer)
- Cloud-based video storage and streaming
- Responsive UI for both mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens) |
| **Media Storage** | Cloudinary / AWS S3 (video uploads) |
| **Deployment** | Vercel (Frontend) |

---

## 📁 Project Structure

```
Foodify/
├── Backend/
│   ├── controllers/       # Route handlers (auth, orders, vendors, dishes)
│   ├── models/            # Mongoose schemas (User, Dish, Order, Store)
│   ├── routes/            # Express route definitions
│   ├── middleware/         # Auth middleware, error handlers
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point
│
├── Frontend/
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page-level views (Home, Store, Cart, etc.)
│       ├── context/       # React Context (Auth, Cart)
│       ├── utils/         # API calls, helpers
│       └── App.js         # Root component
│
└── .gitignore
```
**Pavan** — [@pavan26r](https://github.com/pavan26r)
---
<div align="center">
  Made with ❤️ to bring real food experiences online
  <br/>
  <a href="https://foodify-frontend-ten.vercel.app">🚀 Try Foodify Live</a>
</div>
