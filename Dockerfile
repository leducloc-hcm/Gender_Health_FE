#Step 1: Build the frontend
FROM node:alpine3.18 AS build
WORKDIR /app
COPY package.json .
RUN npm install -f
RUN npm rebuild esbuild
COPY . .
RUN npm run build

#Step 2: Serve the frontend
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]