"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const PORT = env_1.env.PORT;
async function startServer() {
    try {
        // Test database connection
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        console.log('✓ Database connection successful');
        // Start server
        app_1.default.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ Environment: ${env_1.env.NODE_ENV}`);
            console.log(`✓ Frontend URL: ${env_1.env.FRONTEND_URL}`);
        });
    }
    catch (error) {
        console.error('✗ Failed to start server:', error);
        await prisma_1.prisma.$disconnect();
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n✓ Shutting down gracefully...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n✓ Shutting down gracefully...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=server.js.map