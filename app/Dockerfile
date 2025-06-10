# ===========================
# Stage: development
# ===========================
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

# ===========================
# Stage: production
# ===========================
FROM node:20-alpine AS prod

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npm run build

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
