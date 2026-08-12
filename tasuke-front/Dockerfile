FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN echo "=== PACKAGE.JSON ===" \
    && grep -n '"typescript":' package.json \
    && echo "=== PACKAGE-LOCK ===" \
    && grep -n 'typescript' package-lock.json | head -10 \
    && echo "=== TYPESCRIPT 5.9.3 ===" \
    && (grep -n '5.9.3' package-lock.json | head -10 || true)

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=0 /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]