# ============================================================
# SkillForge AI — Production Dockerfile
# Two-stage build:
#   Stage 1 (builder) : installs dependencies & runs vite build
#   Stage 2 (runner)  : copies only the tiny /dist output into
#                        a lightweight Nginx web server image
# Result: ~25 MB image instead of ~800 MB with node_modules
# ============================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first (better Docker layer caching)
# If package.json hasn't changed, Docker skips npm install on rebuild
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Pass the Gemini API key as a build-time argument
# Usage: docker build --build-arg VITE_GEMINI_API_KEY=your_key .
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Run vite build — outputs static files to /app/dist
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Remove the default Nginx placeholder page
RUN rm -rf /usr/share/nginx/html/*

# Copy our built static files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles React SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard HTTP)
EXPOSE 80

# Start Nginx in the foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
