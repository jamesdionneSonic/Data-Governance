FROM node:20-alpine

WORKDIR /workspace

# Copy package files
COPY package*.json ./

# Install production dependencies without lifecycle scripts
RUN npm ci --omit=dev --omit=optional --ignore-scripts

# Copy source code
COPY src/ ./src/
COPY config/ ./config/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
