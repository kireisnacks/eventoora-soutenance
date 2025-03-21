// Import the PrismaClient class from the @prisma/client package.
// PrismaClient is used to interact with your database.
import { PrismaClient } from "@prisma/client";

// Declare a global variable 'prisma' of type PrismaClient or undefined.
// This allows the Prisma client instance to be accessed globally.
declare global {
    var prisma: PrismaClient | undefined
}

// Initialize the Prisma client.
// If 'globalThis.prisma' is already defined (i.e., in a non-production environment),
// use the existing instance to avoid creating multiple instances.
// Otherwise, create a new PrismaClient instance.
const client = globalThis.prisma || new PrismaClient();

// In a non-production environment, assign the Prisma client instance to the global variable 'prisma'.
// This is useful for hot-reloading in development environments (e.g., using tools like Next.js).
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = client;
}

// Export the Prisma client instance as the default export.
// This allows other modules to import and use this instance for database interactions.
export default client;
