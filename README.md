# Node.js Auth Service (Dockerized)

This is a simple Node.js authentication service that uses **MongoDB**, **Redis**, and **JWT** for authentication. This README provides steps to run the service with Docker.

---

## Prerequisites

- [Docker](https://www.docker.com/) installed (version 20+ recommended)
- [Docker Compose](https://docs.docker.com/compose/) installed (version 1.29+ recommended)

---

## Project Structure

```bash
.
├─ .env            # Environment variables (app, DB, redis, etc.)
├─ .pro/           # Folder containing the Dockerfile (moved for production config)
│   └─ Dockerfile
├─ docker-compose.yml
├─ server.js       # The main entry point for your Node.js app
├─ ...
└─ README.md       # This file
```

### `.pro/Dockerfile`

A typical **Dockerfile** (Node 20 Alpine):

```dockerfile
# .pro/Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### `docker-compose.yml`

```yaml
version: '3.9'

services:
  app:
    build:
      context: .       # The build context is the project root
      dockerfile: .pro/Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:5
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root

  redis:
    image: redis:latest
    restart: always
    ports:
      - "6379:6379"
    command: redis-server --requirepass root
    environment:
      - REDIS_PASSWORD=root

volumes:
  mongo-data:
```

---

## Getting Started

1. **Clone** this repository or copy these files into your local project folder.

2. **Create a `.env` file** at the project root (if you haven’t already). Ensure it has the required environment variables. For example:
   ```ini
   PORT=3000
   MONGO_URI=mongodb://root:root@mongo:27017/auth_service_db?authSource=admin
   JWT_SECRET=supersecretkey
   JWT_EXPIRES_IN=90d
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_PASSWORD=root
   ```
3. **Build and Run** using Docker Compose:
   ```bash
   docker-compose up --build
   ```
    - `--build` ensures the image is rebuilt from the `Dockerfile`.
    - After starting, the app container (`app`) will run on **port 3000**.
    - MongoDB is on **port 27018** externally (mapped to 27017 internally).
    - Redis is on **port 6380** externally (mapped to 6379 internally).

4. **Check Logs** (optional):
   ```bash
   docker-compose logs -f
   ```
   This shows streaming logs for the services.

5. **Stop Containers**:
    - Press `Ctrl + C` in the terminal running Docker Compose, or
    - Run `docker-compose down` in a separate terminal.

6. **Remove Volumes** (optional, **data will be lost**):
   ```bash
   docker-compose down -v
   ```
   This command removes all containers, networks, and **named volumes** (for a clean slate).

---

## Testing the Service

Once everything is running, you can test the endpoints (e.g., with [Postman](https://www.postman.com/) or `curl`).

- **Health Check** (if you added a `/health` endpoint):
  ```
  GET http://localhost:3000/health
  ```

- **Request OTP** (Sign In):
  ```
  POST http://localhost:3000/auth/signin
  Content-Type: application/json

  {
    "email": "test@example.com"
  }
  ```

- **Verify OTP**:
  ```
  POST http://localhost:3000/auth/verify
  Content-Type: application/json

  {
    "email": "test@example.com",
    "otp": "123456"
  }
  ```

- **Use JWT** for protected routes (e.g., `GET /users`). Attach the token in the header:
  ```
  GET http://localhost:3000/users
  Authorization: Bearer <jwt_token_here>
  ```

---

**Enjoy your Node.js Auth Service!**  