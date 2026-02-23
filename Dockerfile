# -------------------------
# deps
# -------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# (Optional but helpful) ensure CA certs exist for TLS, and pin Yarn via corepack
RUN apk add --no-cache ca-certificates \
  && corepack enable \
  && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./

# Fix common "integrity mismatch" issues: clear cache + use official registry + increase timeout
RUN yarn config set registry https://registry.npmjs.org \
  && yarn cache clean --all \
  && yarn install --frozen-lockfile --network-timeout 600000

# -------------------------
# builder
# -------------------------
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable \
  && corepack prepare yarn@1.22.22 --activate

ARG NEXT_PUBLIC_NAME
ARG NEXT_PUBLIC_PRERENDER_LIMIT
ARG NEXT_PUBLIC_BASE
ARG NEXT_PUBLIC_INDEX
ARG NEXT_PUBLIC_RATES_MIN
ARG NEXT_PUBLIC_RATES_RENDER_MIN
ARG NEXT_PUBLIC_TELEGRAM_SUPPORT
ARG NEXT_PUBLIC_TELEGRAM_BOT
ARG NEXT_PUBLIC_TELEGRAM_CHAT
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY

ENV NEXT_PUBLIC_NAME=$NEXT_PUBLIC_NAME \
    NEXT_PUBLIC_PRERENDER_LIMIT=$NEXT_PUBLIC_PRERENDER_LIMIT \
    NEXT_PUBLIC_BASE=$NEXT_PUBLIC_BASE \
    NEXT_PUBLIC_INDEX=$NEXT_PUBLIC_INDEX \
    NEXT_PUBLIC_RATES_MIN=$NEXT_PUBLIC_RATES_MIN \
    NEXT_PUBLIC_RATES_RENDER_MIN=$NEXT_PUBLIC_RATES_RENDER_MIN \
    NEXT_PUBLIC_TELEGRAM_SUPPORT=$NEXT_PUBLIC_TELEGRAM_SUPPORT \
    NEXT_PUBLIC_TELEGRAM_BOT=$NEXT_PUBLIC_TELEGRAM_BOT \
    NEXT_PUBLIC_TELEGRAM_CHAT=$NEXT_PUBLIC_TELEGRAM_CHAT \
    NEXT_PUBLIC_GOOGLE_MAPS_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN yarn build

# -------------------------
# runner
# -------------------------
FROM node:20-alpine AS runner
WORKDIR /app

RUN corepack enable \
  && corepack prepare yarn@1.22.22 --activate

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start", "-p", "3000"]