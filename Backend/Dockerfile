# ---------- BUILD STAGE ----------
FROM node:23-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install 

COPY . .
RUN yarn build


# ---------- RUNTIME STAGE ----------
FROM node:23-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install  --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
