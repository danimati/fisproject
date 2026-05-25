FROM node:20-bullseye

WORKDIR /app

ARG API_URL=/back/
ENV API_URL=${API_URL}

COPY package*.json ./
RUN npm install

COPY . .

RUN sed -i "s|https://ptwl9d2t-80.use2.devtunnels.ms|${API_URL}|g" src/environments/environment.ts || true
RUN sed -i "s|http://localhost:80|${API_URL}|g" src/environments/environment.prod.ts || true
RUN sed -i 's|<base href="/">|<base href="/front/">|g' src/index.html || true

EXPOSE 4200

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--serve-path", "/front/", "--allowed-hosts=true"]