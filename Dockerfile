# Stage 1: Build Frontend (VueJS)
FROM node:18 AS frontend-build

# Set the working directory for frontend
WORKDIR /frontend-app

# Copy frontend package.json and yarn.lock to install dependencies
COPY frontend-app/package*.json ./
RUN yarn install

# Copy all frontend files to the container
COPY frontend-app/ ./

# Build the VueJS app (production-ready)
RUN yarn build

# Stage 2: Build Backend (NodeJS/Fastify)
FROM node:18 AS backend-build

# Set the working directory for backend
WORKDIR /backend

# Copy backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy all backend files to the container
COPY backend/ ./

# Run the backend build (if you are using TypeScript, this step compiles it)
RUN npm run build

# Stage 3: Final Image (Combine Frontend and Backend)
FROM node:18

# Set the working directory for the final image
WORKDIR /app

# Copy built frontend files from the frontend build stage
COPY --from=frontend-build /frontend-app/dist /app/frontend

# Copy backend files and node_modules from the backend build stage
COPY --from=backend-build /backend /app/backend
COPY --from=backend-build /backend/node_modules /app/backend/node_modules

# Set environment variables for production
ENV NODE_ENV=production

# Expose the port that the backend will run on
EXPOSE 3000

# Start the Fastify server (make sure the backend package.json has a start script)
WORKDIR /app/backend
CMD ["npm", "run", "start"]
