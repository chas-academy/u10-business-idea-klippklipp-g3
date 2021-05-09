# Use node 15 (compatible with node-sass)
FROM node:15.14.0-alpine3.12
# Set working directory
WORKDIR /app/frontend
# Copy package.json for installer in next step
COPY package.json .
# Update npm to latest version
RUN npm i -g npm@latest
# Install other dependencies
RUN npm i
# Expose port 3000
EXPOSE 3000
# npm run start to start react app
CMD ["npm", "start"]