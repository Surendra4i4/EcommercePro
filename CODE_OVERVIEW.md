# Code Overview

This document provides an overview of the key components and files in the e-commerce application.

## Key Files and Components

### Backend

#### `server/auth.ts`
- Sets up passport for authentication
- Defines routes for user registration and login
- Handles user session management

#### `server/routes.ts`
- Defines API endpoints for products, orders, etc.
- Registers the authentication routes

#### `server/storage.ts`
- Implements in-memory storage for users, products, orders
- Defines methods for CRUD operations on data
- Can be extended to use a database like PostgreSQL

### Frontend

#### `client/src/App.tsx`
- Main application component
- Sets up routing using Wouter
- Wraps the application with necessary providers (Auth, Cart, etc.)

#### `client/src/hooks/use-auth.tsx`
- Provides authentication context and hooks
- Handles login, logout, and registration logic
- Stores and retrieves the current user

#### `client/src/hooks/use-cart.tsx`
- Manages shopping cart state
- Provides methods for adding, removing, and updating cart items
- Calculates cart totals

#### `client/src/lib/currency.ts`
- Utility functions for currency conversion
- Converts USD to INR and formats currency strings
- Used throughout the application to display prices in INR

#### `client/src/components/shopping-cart.tsx`
- Shopping cart UI component
- Displays items in the cart with quantities and prices
- Shows cart total in INR with USD reference

#### `client/src/components/checkout-form.tsx`
- Multi-step checkout process
- Collects shipping information
- Provides Indian payment options (Credit/Debit Card, PhonePe, Google Pay, Paytm)
- Displays order summary with prices in INR

#### `client/src/pages/auth-page.tsx`
- Authentication page with login and registration forms
- Redirects authenticated users to the home page

#### `client/src/pages/home-page.tsx`
- Main landing page
- Displays product listing and categories
- Provides filtering and sorting options

## Data Flow

1. **Authentication Flow**
   - User enters credentials on the auth page
   - Frontend sends login/register request to the backend
   - Backend validates credentials and creates a session
   - Frontend stores user information in auth context
   - Protected routes check auth context before rendering

2. **Shopping Flow**
   - Products are fetched from the backend API
   - User adds products to the cart (managed in cart context)
   - Cart data is persisted in localStorage
   - User proceeds to checkout
   - Shipping information and payment method are collected
   - Order is submitted to the backend
   - User is redirected to the home page after successful order

3. **Indian Currency Implementation**
   - Product prices are stored in USD in the backend
   - Frontend uses currency conversion utilities to display prices in INR
   - Shopping cart and checkout components show INR prices with USD reference
   - Order totals are calculated in USD and converted to INR for display

## Key Features Implementation

### Indian Payment Methods

The checkout form includes options for Indian payment methods:
- PhonePe
- Google Pay
- Paytm

Each payment method has a custom SVG icon and is implemented as a radio button option in the payment step of the checkout process.

### Currency Conversion

The application uses a fixed exchange rate (1 USD = 75 INR) for currency conversion. The `currency.ts` file provides several utility functions:

- `usdToInr`: Converts USD amount to INR
- `formatInr`: Formats a number as an INR string with the ₹ symbol
- `formatUsd`: Formats a number as a USD string with the $ symbol
- `getInrFromUsd`: Returns both the converted amount and formatted string

These functions are used consistently throughout the application to ensure uniform price display.

## Component Structure

The application follows a modular component structure:

- **Layout Components**: Header, Footer, Layout wrapper
- **Page Components**: Home, Auth, Checkout, Admin
- **Feature Components**: ProductCard, ProductGrid, ShoppingCart, CheckoutForm
- **UI Components**: Button, Card, Input, etc. (using shadcn/ui)

## State Management

The application uses a combination of:

- **React Context API** for global state (auth, cart)
- **TanStack Query** for server state and data fetching
- **React Hook Form** for form state
- **localStorage** for persisting cart data between sessions