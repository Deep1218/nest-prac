# Nest Prac

This project is a hands-on exploration of key features and best practices in building robust and scalable APIs using NestJS. Below is an overview of the functionalities implemented.

## Features

### 1. API Documentation

- **Swagger Integration**: Comprehensive API documentation using Swagger.
  - Provides an interactive UI to explore and test endpoints.
  - Auto-generated based on decorators and metadata.

### 2. Serialization

- Implements serialization to transform data before sending it to the client.
- Ensures sensitive fields are excluded from API responses.
- Supports custom serializers for specific use cases.

### 3. API Versioning

- Enables versioning to support backward compatibility.
- Version-specific controllers ensure flexibility in API evolution.
- Supports URL and header-based versioning strategies.

### 4. Database Integration

- **Prisma ORM**: Efficient database interaction using Prisma.
  - **Transactions**: Implements database transactions for consistent and reliable operations.
  - **Multi-Database Connections**: Supports simultaneous connections to multiple databases.
  - **Seeders**: Populates the database with initial data for testing and development.
  - **Migrations**: Handles schema changes across multiple databases seamlessly.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli)
- I have used PostgreSQL but the database setup compatible with Prisma (e.g., PostgreSQL, MySQL, or SQLite).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Deep1218/nest-prac.git
   cd https://github.com/Deep1218/nest-prac.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:

   - Create a `.env` file in the root directory.
   - Define the necessary variables (refer to `.env.example` for guidance).

4. Run database migrations (primary database):
   ```bash
   npm run prisma:main:migrate
   ```
5. Run database migrations (scedonary database):
   ```bash
   npm run prisma:user:migrate
   ```
6. Seed the database (if you want to manullay run):
   ```bash
   npx prisma db seed
   ```

### Running the Application

- Development mode:
  ```bash
  npm run start:dev
  ```
- Production mode:
  ```bash
  npm run start:prod
  ```

### Accessing Swagger Docs

- Visit `http://localhost:3000/docs` to access the interactive API documentation.
- Visit `http://localhost:3000/docs/json` to access the API documentation json which you can import to postman.
