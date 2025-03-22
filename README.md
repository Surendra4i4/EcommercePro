# Modern E-Commerce Platform

A complete e-commerce solution with product listings, shopping cart functionality, user authentication, and checkout with Indian payment options. The application displays prices in Indian Rupees (INR) with USD reference.

## Features

- **User Authentication**
  - Registration and login
  - Protected routes for authenticated users
  - User session management

- **Product Catalog**
  - Browse products with image and description
  - Filter and sort products by category, price, etc.
  - Responsive product grid layout

- **Shopping Cart**
  - Add/remove products from cart
  - Adjust product quantities
  - Persistent cart across sessions

- **Checkout Process**
  - Multi-step checkout (shipping info and payment)
  - Support for Indian payment methods (PhonePe, Google Pay, Paytm)
  - Order summary with prices in INR
  - Address and shipping information collection

- **Internationalization**
  - Price display in INR with USD reference
  - Currency conversion utilities

- **Admin Dashboard** (for future development)
  - Manage products (add/edit/delete)
  - View and process orders
  - Customer management

## Tech Stack

- **Frontend**
  - React.js for UI components
  - TanStack Query for data fetching
  - Tailwind CSS with Shadcn UI for styling
  - Wouter for routing
  - React Hook Form for form handling
  - Context API for state management

- **Backend**
  - Node.js with Express
  - In-memory storage (can be extended to use PostgreSQL)
  - Authentication with Passport.js
  - Session management

- **Build Tools**
  - Vite for development and building
  - TypeScript for type safety
  - Drizzle for ORM

## Project Structure

```
.
├── client
│   ├── src
│   │   ├── components      # UI components
│   │   ├── hooks           # Custom React hooks
│   │   ├── lib             # Utility functions
│   │   ├── pages           # Page components
│   │   ├── App.tsx         # Main application component
│   │   ├── index.css       # Global styles
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server
│   ├── auth.ts             # Authentication setup
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage
│   └── vite.ts             # Vite server config
├── shared
│   └── schema.ts           # Shared data schema
├── drizzle.config.ts       # Drizzle ORM config
├── tsconfig.json           # TypeScript config
├── package.json            # Project dependencies
└── vite.config.ts          # Vite build config
```

## Key Components

### Authentication

The application uses a session-based authentication system with Passport.js. Users can register, log in, and access protected routes. User sessions are managed through express-session.

### Product Catalog

Products are displayed in a responsive grid layout with filtering and sorting options. Each product card shows the product image, name, price (in INR with USD reference), and provides options to add the product to the cart.

### Shopping Cart

The shopping cart is implemented using React Context API. Cart items are stored in the browser's localStorage to persist them between page refreshes. Users can add, remove, and adjust quantities of products in their cart.

### Checkout

The checkout process is divided into two steps:
1. Shipping information collection
2. Payment method selection

The application supports multiple Indian payment methods, including:
- Credit/Debit Card
- PhonePe
- Google Pay
- Paytm

### Currency Conversion

The application converts prices from USD to INR using a fixed exchange rate. The converted prices are displayed prominently, with the original USD price shown as a reference.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to http://localhost:5000

## Future Enhancements

- Integration with a real payment gateway
- Product reviews and ratings
- User wishlist functionality
- Advanced search capabilities
- Real-time order tracking
- Email notifications
- Mobile app development

## License

This project is licensed under the MIT License - see the LICENSE file for details.