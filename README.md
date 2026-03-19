# ScriptFlow Marketplace

A modern marketplace platform for buying and selling automation scripts and workflows.

## Features

- **Multi-role System**: Admin, Seller, and Buyer roles with different permissions
- **Seller Levels**: Progressive leveling system from New Creator to Legendary Creator
- **Dashboard Analytics**: Comprehensive analytics for sellers and admins
- **Secure Authentication**: Role-based access control
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run serve
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── DashboardLayout.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and stores
├── pages/              # Page components
│   ├── admin/          # Admin-only pages
│   ├── dashboard/      # Dashboard pages
│   └── ...
└── App.tsx             # Main app component
```

## Roles and Permissions

### Admin
- Manage all users
- View analytics
- Suspend/approve sellers
- Full system access

### Seller
- Create and manage listings
- View sales analytics
- Manage inventory
- Track revenue

### Buyer
- Browse and purchase scripts
- View purchase history
- Manage favorites

## License

Private project. All rights reserved.
