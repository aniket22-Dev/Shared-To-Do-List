# Shared To-Do List

## Objective

The objective of this project is to develop an end-to-end application that integrates various technologies for task management. The application includes authentication, task management, and a way to share tasks with other users.

## Technologies

- **Backend**: NodeJS (with Fastify for Serverless Functions)
- **Frontend**: VueJS with Pinia and Vite
- **Database**: PostgreSQL
- **Authentication**: Firebase
- **Languages**: TypeScript (for both frontend and backend)
- **Containerization**: Docker for the frontend, backend, and database (using `docker-compose`)
- **Repository Structure**: Monorepo

## Features

### User Interface
- **Login Screen**: ID and password-based login and user creation.
- **Task List**: Display a list of tasks created by and shared with the user.
- **Filter Dropdown**: Allows the user to filter tasks by:
  - All Tasks
  - My Tasks
  - Shared Tasks
- **Share Task Popup**: A popup to allow the user to share tasks with others.

### Backend APIs
- **Login/Signup Flow**: APIs to handle user login and signup, storing user data in the database.
- **CRUD Operations for Tasks**: Create, Read, Update, and Delete tasks.
- **Share Task API**: API to share tasks with other users.

## Expected Deliverables

- **Github Repository**: A fully functional application with the source code.
- **DBML File**: Database schema in DBML format.
- **Environment Variables**: Proper configuration files for environment variables.
- **Development Instructions**: Clear instructions for running the servers in a local development environment.

## Setting Up the Project Locally

### Prerequisites

- Docker
- Docker Compose
- Node.js (with NPM or Yarn)
- PostgreSQL

### Steps to Run Locally

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>

2. Navigate to the `frontend` directory:
    ```bash
    cd frontend-app
    ```
3. Install the required dependencies:
    ```bash
    yarn install
    ```
4. Start the frontend:
    ```bash
    yarn dev
    ```

### Backend Setup

To set up and run the backend locally:

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the backend:
    ```bash
    npm run start

# Database Configuration
DB_HOST=dpg-cvt12vq4d50c73dbivr0-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=shared_to_do_production_user
DB_PASSWORD=e4T4Twmqkhf8VMvrRK1MVU6lSCb587eJ
DB_NAME=shared_to_do_production

# Server Configuration
PORT=3000
HOST=0.0.0.0

### Backend Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:


# Firebase Configuration
FIREBASE_PROJECT_ID=shared-to-do-list-a3316
FIREBASE_PRIVATE_KEY_ID=a5bd2dbe154b017214431da440d3d4c246209779
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCo4iMytTUKZkcW\n7Ie+QAUEEKCbIWHppedTUoHxsWITwSe5cwELTWuWHuHSu4DBlZ4zwWfpF1izYm9I\nlZaN1IpNaIcF1VIt7hrVkrm26qXiW4hF4TzTY4w94VKN0JQhZpOI9KzplhMCvKBD\nl5kQL60xUw/cJxrneVzp/AkiQ1N6LDQ1SeUWK166nHBaNVhKtsuxGxQX8bmfHIyD\nfkmIXRAroDQp5PrfDqzfMvcs0tGLYNL5L7232p/F3uX7BEqvFPx3aSzk
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@shared-to-do-list-a3316.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=101689181505792620509
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40shared-to-do-list-a3316.iam.gserviceaccount.com



