# Step 1: Build the Vite frontend
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install -f

# Copy the rest of the source code
COPY . .

# Build the app for production
RUN npm run build
RUN touch .env
ENV VITE_API_BASE_URL=http://ec2-52-221-179-12.ap-southeast-1.compute.amazonaws.com:4000
ENV VITE_GOOGLE_CLIENT_ID="928966535131-jc1iutqk21arfti7slbcc2obd79i4c90.apps.googleusercontent.com"
ENV VITE_GOOGLE_CLIENT_SECRET="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"
ENV VITE_GOOGLE_REDIRECT_URI="http://ec2-52-221-179-12.ap-southeast-1.compute.amazonaws.com:4000/users/oauth/google"
# Step 2: Serve the built app using NGINX
FROM nginx:1.23-alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start NGINX

CMD ["nginx", "-g", "daemon off;"]
