# Exit immediately if a command exits with a non-zero status
set -e

# Update dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Run database migrations (if any)
npx prisma migrate deploy

# Start the application
npm start

