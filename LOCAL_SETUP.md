# Local Setup Guide

This guide will help you set up and run the e-commerce project on your local machine.

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm or yarn

## Step 1: Clone or Download the Repository

You can either clone this repository from Replit or download it as a ZIP file.

## Step 2: Install Dependencies

Navigate to the project folder in your terminal and run:

```bash
npm install
```

This will install all the required dependencies listed in the package.json file.

## Step 3: Set Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```
SESSION_SECRET=your_session_secret_here
```

## Step 4: Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

This command will start both the backend server and the frontend development server.

## Step 5: Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

You should now see the e-commerce application running with the following features:
- Product listings with INR prices
- Shopping cart functionality
- User registration and login
- Checkout with Indian payment options

## Project Structure

Here's a quick overview of the project structure:

```
.
├── client                 # Frontend code
│   ├── src                # React components and hooks
│   └── index.html         # Main HTML file
├── server                 # Backend code
│   ├── auth.ts            # Authentication logic
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage
│   └── index.ts           # Server entry point
├── shared                 # Shared code between frontend and backend
│   └── schema.ts          # Data schemas
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Troubleshooting

If you encounter any issues:

1. **Port conflicts**: If port 5000 is already in use, you can modify the port in `server/index.ts`.

2. **Dependency issues**: Make sure you're using the correct Node.js version. If you encounter dependency errors, try:
   ```bash
   npm install --force
   ```

3. **Build errors**: If you encounter build errors, try clearing the cache:
   ```bash
   npm run clean
   npm install
   npm run dev
   ```

## Additional Commands

- **Build for production**:
  ```bash
  npm run build
  ```

- **Start production server**:
  ```bash
  npm start
  ```

- **Run TypeScript checks**:
  ```bash
  npm run typecheck
  ```

## Notes for Local Development

- The application uses in-memory storage by default, so data will be reset when the server restarts.
- The currency conversion is done using a fixed rate (1 USD = 75 INR) and not a real API.
- The payment methods are for demonstration purposes and don't connect to actual payment gateways.