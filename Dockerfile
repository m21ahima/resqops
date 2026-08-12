# Use an official lightweight Node.js image as the base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first (before app code)
COPY package*.json ./

# Install dependencies inside the container
RUN npm install --production

# Now copy the rest of the app code
COPY . .

# Tell Docker which port the app listens on
EXPOSE 3000

# Command to run when the container starts
CMD ["node", "index.js"]