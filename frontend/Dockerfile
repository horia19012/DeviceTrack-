FROM node:22 AS node
WORKDIR /frontend/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --omit=dev --configuration=production

COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:alpine
COPY /dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
