# BNB Application

This project is a full-stack property rental platform, similar to Airbnb. It allows users to browse, book, and manage property listings. It is built as a monorepo containing a Next.js frontend and a Hono backend API.

## About The Project

The application provides the following main features:

-   **User Management:** Users can sign up, sign in, and manage their profile.
-   **Browse Properties:** All users can browse and view a list of available properties.
-   **Property Details:** Users can view detailed information for each property, including images, description, pricing, and an availability calendar.
-   **Bookings:** Authenticated users can book properties for specific date ranges.
-   **Profile Management:** Logged-in users have a profile page to:
    -   View their upcoming and past bookings.
    -   Manage the properties they are renting out.
    -   Edit their user settings.
-   **Property Management:** Users can create, edit, and delete their own property listings.

## Tech Stack

-   **Frontend:** Next.js, React, Tailwind CSS, DaisyUI
-   **Backend:** Hono, Node.js
-   **Database:** Supabase (PostgreSQL)
-   **DevOps & Tooling:** Docker, GitHub Actions, PNPM Workspaces

## Recent Changes

-   **Property Updates:** The method for updating properties has been changed from `PUT` to `PATCH`. This allows for partial updates to a property, meaning you only need to send the fields you want to change, rather than the entire property object. This makes the API more efficient and easier to use.
-   **Data Refetching:** The frontend now uses a callback function called `onDataChange` to automatically refetch data after a property is created, updated, or deleted. This ensures that the UI is always up-to-date with the latest data from the backend.

## Getting Started

The recommended way to run this project is by using Docker.

### Prerequisites

-   Docker and Docker Compose must be installed on your machine.
-   You need a Supabase project. You can create one for free at [supabase.com](https://supabase.com).

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bnb-application
    ```

2.  **Configure Backend Environment:**
    Create a `.env` file inside the `bnb-backend` directory (`bnb-backend/.env`) and add your Supabase credentials.

    ```env
    # bnb-backend/.env

    # Get these from your Supabase project settings (Project Settings > API)
    SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
    ```

3.  **Configure Frontend Environment:**
    Create a `.env.local` file inside the `bnb-frontend` directory (`bnb-frontend/.env.local`) and add the following variables.

    ```env
    # bnb-frontend/.env.local

    NEXT_PUBLIC_API_URL=http://localhost:3000
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **Build and Run with Docker:**
    From the root of the project, run the following command:
    ```bash
    docker-compose up --build
    ```
    This will build the Docker images for the frontend and backend and start the services.

5.  **Access the application:**
    -   Frontend: [http://localhost:8080](http://localhost:8080)
    -   Backend: [http://localhost:3000](http://localhost:3000)

## API Routes

The backend exposes a RESTful API for managing resources.

### Auth Routes (`/api/auth`)

| Method | Route               | Description                     |
|--------|---------------------|---------------------------------|
| `POST` | `/signup`           | Register a new user.            |
| `POST` | `/signin`           | Log in a user.                  |
| `POST` | `/signout`          | Log out the current user.       |
| `POST` | `/forgot-password`  | Send a password reset email.    |
| `POST` | `/reset-password`   | Reset the user's password.     |
| `GET`  | `/me`               | Get the current user's profile.  |
| `PUT`  | `/profile`          | Update the current user's profile.|

### Property Routes (`/api/properties`)

| Method   | Route             | Description                           | Protected |
|----------|-------------------|---------------------------------------|-----------|
| `GET`    | `/`               | Get all properties.                   | No        |
| `GET`    | `/:id`            | Get a single property by ID.          | No        |
| `GET`    | `/me`             | Get properties for the logged-in user.| Yes       |
| `GET`    | `/:id/bookings`   | Get all bookings for a property.      | No        |
| `POST`   | `/`               | Create a new property.                | Yes       |
| `PATCH`  | `/:id`            | Update a property.                    | Yes       |
| `DELETE` | `/:id`            | Delete a property.                    | Yes       |

### Booking Routes (`/api/bookings`)

| Method   | Route  | Description                   | Protected |
|----------|--------|-------------------------------|-----------|
| `GET`    | `/`    | Get bookings for logged-in user.| Yes       |
| `GET`    | `/:id` | Get a single booking by ID.     | Yes       |
| `POST`   | `/`    | Create a new booking.           | Yes       |
| `PATCH`  | `/:id` | Update a booking.               | Yes       |
| `DELETE` | `/:id` | Cancel a booking.               | Yes       |
