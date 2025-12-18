# Task Manager Application

A modern, full-stack Task Manager application built with **NestJS** (Backend) and **React Native / Expo** (Mobile).

## 🚀 Project Overview

The project is designed as a monorepo containing both the backend API and the mobile client, orchestrated via Docker for local development.

### 🏗️ Tech Stack

#### **Backend (`/backend`)**
*   **Framework**: [NestJS](https://nestjs.com/)
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Caching**: Redis
*   **Authentication**: JWT (Access + Refresh Tokens)
*   **Notifications**: Expo Server SDK

#### **Mobile (`/mobile`)**
*   **Framework**: [Expo](https://expo.dev/) (React Native)
*   **State Management**: Zustand
*   **Data Fetching**: TanStack React Query (with Optimistic Updates)
*   **UI/UX**: Glassmorphism Design, Linear Gradients
*   **Storage**: Expo Secure Store & Async Storage

#### **Infrastructure**
*   **Docker Compose**: Orchestrates API, PostgreSQL, and Redis services.
*   **CI/CD**: GitHub Actions for linting and testing.

## 🛠️ Getting Started

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
*   [Node.js](https://nodejs.org/) (LTS recommended).
*   [Expo Go](https://expo.dev/client) on your mobile device (optional, for physical device testing).

### ⚡ Quick Start

1.  **Start the Backend & Infrastructure**
    Run the entire backend stack (API + DB + Redis) using Docker Compose:
    ```bash
    docker-compose up --build
    ```
    *   API will run on `http://localhost:3000`
    *   PostgreSQL on port `5432`
    *   Redis on port `6379`

2.  **Run the Mobile App**
    Open a new terminal, navigate to the mobile folder, and start the development server:
    ```bash
    cd mobile
    npm install
    npm start
    ```
    *   Scan the QR code with the **Expo Go** app on your phone.
    *   Or press `a` to run on Android Emulator.

## 📂 Project Structure

```
/
├── backend/            # NestJS API source code
├── mobile/             # React Native Expo app
├── docker-compose.yml  # Docker orchestration config
└── .github/            # CI/CD Workflows
```
