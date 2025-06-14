# File-Based Routing Express Server

A Next.js-inspired file-based routing system for Express.js APIs built with TypeScript. This project automatically maps your file system structure to API routes, eliminating the need to manually define routes in your Express application.

## 🚀 Features

- **File-Based Routing**: Automatic route generation based on file structure
- **Dynamic Routes**: Support for parameterized routes using bracket notation `[param]`
- **HTTP Method Handlers**: Clean separation of HTTP methods (GET, POST, PUT, DELETE, etc.)
- **Auto Parameter Injection**: Dynamic route parameters automatically injected into `req.params`
- **Hot Reload**: Development server with automatic restart on file changes

## 📁 Project Structure

```
src/
├── routes/                # Route definitions (maps to API endpoints)
│   ├── users/
│   │   ├── index.ts       # /users endpoint
│   │   └── [userId]/
│   │       └── index.ts   # /users/:userId endpoint
│   └── books/
│       ├── index.ts       # /books endpoint
│       └── [bookId]/
│           └── index.ts   # /books/:bookId endpoint
├── utils/
│   ├── constants.ts       # Configuration constants
│   └── regex.ts           # Dynamic route regex patterns
└── index.ts               # Main server file
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/patryksztuczka/file-based-routing
cd file-based-routing

# Install dependencies
pnpm install
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
pnpm dev
```

Server runs on `http://localhost:3000` with hot reload enabled.

### Production Mode

```bash
pnpm start
```

### Other Scripts

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## 📖 How It Works

### Route Definition

Create route files in the `src/routes` directory. Each file should export named functions corresponding to HTTP methods:

```typescript
// src/routes/users/index.ts
import { Request, Response } from 'express';

export const GET = async (req: Request, res: Response) => {
  return 'Get all users';
};

export const POST = async (req: Request, res: Response) => {
  return 'Create new user';
};

export const PUT = async (req: Request, res: Response) => {
  return 'Update user';
};

export const DELETE = async (req: Request, res: Response) => {
  return 'Delete user';
};
```

### Dynamic Routes

Use bracket notation for dynamic parameters:

```typescript
// src/routes/users/[userId]/index.ts
import { Request } from 'express';

export const GET = (req: Request) => {
  const { userId } = req.params; // Automatically injected

  // Your logic here
  return `User ID: ${userId}`;
};
```

### Route Mapping Examples

| File Path                            | API Endpoint     | Description    |
| ------------------------------------ | ---------------- | -------------- |
| `src/routes/users/index.ts`          | `GET /users`     | Get all users  |
| `src/routes/users/[userId]/index.ts` | `GET /users/123` | Get user by ID |
| `src/routes/books/index.ts`          | `GET /books`     | Get all books  |
| `src/routes/books/[bookId]/index.ts` | `GET /books/456` | Get book by ID |

## 🔧 Configuration

### Constants (`src/utils/constants.ts`)

```typescript
export const PORT = 3000; // Server port
export const RESOURCES_DIR = 'routes'; // Routes directory
```

### Dynamic Route Pattern (`src/utils/regex.ts`)

```typescript
export const DYNAMIC_ROUTE_REGEX = /\[[a-zA-Z]{1,}\]$/gm;
```

## 🎯 API Examples

### Static Routes

```bash
# Get all users
curl http://localhost:3000/users

# Get all books
curl http://localhost:3000/books
```

### Dynamic Routes

```bash
# Get specific user
curl http://localhost:3000/users/123

# Get specific book
curl http://localhost:3000/books/456
```

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Development**: tsx (TypeScript execution)
- **Linting**: ESLint + Prettier
- **Package Manager**: pnpm

## 📝 Adding New Routes

1. Create a new directory/file in `src/routes/`
2. Export HTTP method handlers (GET, POST, PUT, DELETE, etc.)
3. For dynamic routes, use bracket notation `[paramName]`
4. Parameters are automatically available in `req.params`

Example:

```typescript
// src/routes/products/[productId]/reviews/index.ts
import { Request } from 'express';

export const GET = (req: Request) => {
  const { productId } = req.params;
  return `Reviews for product ${productId}`;
};
```

This creates the endpoint: `GET /products/:productId/reviews`
