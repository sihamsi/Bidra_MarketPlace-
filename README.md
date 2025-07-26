# Bidra MP

This repository contains a Spring Boot backend and a React frontend.

## Prerequisites
- **Java 17** for the backend.
- **Node.js** and **npm** for the frontend.

## Running the Backend
1. Navigate to the backend project:
   ```bash
   cd backend/demo
   ```
2. Use the Maven wrapper to start the application:
   ```bash
   ../mvnw spring-boot:run
   ```
   The server will start on `http://localhost:8080` by default.

### Environment Variables
Database credentials and other sensitive values can be supplied via environment variables. For example:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

You can also modify `backend/demo/src/main/resources/application.properties` to set these values directly.

## Running the Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the React development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

Environment variables (such as API base URLs) can be configured using a `.env` file in the `frontend` directory. The frontend expects `REACT_APP_API_URL` to point to the backend server. For local development you can use:

```bash
REACT_APP_API_URL=http://localhost:8080
```
