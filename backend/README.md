# Task Manager Backend

This is the backend API for the Task Manager application, built with [NestJS](https://nestjs.com/).

## Stack

*   **Framework**: NestJS
*   **Language**: TypeScript
*   **Database ORM**: Prisma
*   **Caching**: Redis
*   **Authentication**: Passport (JWT)
*   **Logging**: Pino
*   **Notifications**: Expo Server SDK (Push Notifications)

## Prerequisites

*   Node.js (LTS)
*   npm or yarn
*   Redis server running
*   Database (PostgreSQL recommended, check `schema.prisma`)

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Key Modules

*   **Auth**: Authentication and JWT strategy.
*   **Tasks**: Task management logic.
*   **Users**: User profile management.
*   **Notifications**: Push notifications handling.
