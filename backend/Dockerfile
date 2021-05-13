FROM node:15.14.0-alpine3.12
# Set working directory
WORKDIR /app/backend
# Copy package.json for installer in next step
COPY package.json .
# Install dependencies
RUN npm i
# npm run dev to start node server with nodemon
CMD ["npm", "run", "dev"]