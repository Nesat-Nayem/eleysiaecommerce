# syntax=docker/dockerfile:1
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies first (leverage Docker layer caching)
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Copy source
COPY tsconfig.json ./
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

# Start the server (Bun runs TS directly)
CMD ["bun", "run", "src/index.ts"]
