FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source
COPY src ./src

ENV NODE_ENV=production
EXPOSE 8000

# Create tables automatically (TP friendly)
CMD sh -c "npx prisma db push && node src/server.js"
