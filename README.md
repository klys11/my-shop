# eTrade — Full Stack E-commerce App

A modern e-commerce web application built with React, Node.js, Express, and PostgreSQL.

![React](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue) ![Prisma](https://img.shields.io/badge/ORM-Prisma-lightgrey)

## Live Demo

[etrade-shop.netlify.app](https://etrade-shop.netlify.app)

## Screenshots

![Homepage](public/screenshots/homepage.png)
![Product Detail](public/screenshots/product.png)
![Cart](public/screenshots/cart.png)
![Admin Panel](public/screenshots/admin.png)

## Features

- Browse products with search, category filter, and sort
- Product detail page with related products
- Shopping cart with quantity controls and free shipping indicator
- User registration and login with JWT authentication
- Multi-step checkout flow with shipping address
- Order confirmation page
- Admin panel for managing products and orders
- Fully responsive design

## Tech Stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Frontend   | React 19, React Router v6, Context API |
| Styling    | CSS with custom design tokens          |
| Backend    | Node.js, Express                       |
| Database   | PostgreSQL with Prisma ORM             |
| Auth       | JWT tokens, bcrypt password hashing    |
| Build tool | Vite                                   |
| Deployment | Netlify (frontend), Railway (backend)  |

## Getting Started

### Prerequisites

- Node.js 18+
- The backend API running (see [my-shop-backend](https://github.com/klys11/my-shop-backend))

### Installation

1. Clone the repository

```bash
git clone https://github.com/klys11/my-shop.git
cd my-shop
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root folder

```
VITE_API_URL=http://localhost:4000/api
```

4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
public/
└── images/         # Product images (PNG files)
src/
├── components/     # Reusable UI components (Navbar, Footer, Layout)
├── context/        # Global state (CartContext, AuthContext)
├── pages/          # One file per page
├── services/       # API calls (api.js)
└── styles/         # Global CSS and design tokens
```

## Pages

| Route                 | Page                                       |
| --------------------- | ------------------------------------------ |
| `/`                   | Home — hero, categories, featured products |
| `/products`           | Product catalogue with search and filters  |
| `/products/:id`       | Product detail page                        |
| `/cart`               | Shopping cart                              |
| `/login`              | Login                                      |
| `/register`           | Register                                   |
| `/checkout`           | Multi-step checkout                        |
| `/order-confirmation` | Order confirmation                         |
| `/admin`              | Admin panel (admin only)                   |

## Demo Credentials

| Role  | Email            | Password |
| ----- | ---------------- | -------- |
| Admin | admin@etrade.com | admin123 |

## Backend

[github.com/klys11/my-shop-backend](https://github.com/klys11/my-shop-backend)
