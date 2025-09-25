import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { connectDB } from './config/database';
import { userRoutes } from './routes/userRoutes';
import { productRoutes } from './routes/productRoutes';

// Load environment variables
const PORT = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }))
  .use(swagger({
    documentation: {
      info: {
        title: 'Elysia Ecommerce API',
        version: '1.0.0',
        description: 'A comprehensive ecommerce API built with Elysia.js and MongoDB'
      },
      tags: [
        { name: 'Users', description: 'User management endpoints' },
        { name: 'Products', description: 'Product management endpoints' }
      ],
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server'
        }
      ]
    },
    path: '/docs'
  }))
  .get('/', () => ({
    message: 'Welcome to Elysia Ecommerce API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      users: '/api/users',
      products: '/api/products'
    }
  }))
  .get('/health', () => ({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))
  .use(userRoutes)
  .use(productRoutes)
  .onError(({ code, error, set }) => {
    console.error('Error:', error);
    
    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return {
          success: false,
          message: 'Validation error',
          error: error.message
        };
      case 'NOT_FOUND':
        set.status = 404;
        return {
          success: false,
          message: 'Route not found'
        };
      default:
        set.status = 500;
        return {
          success: false,
          message: 'Internal server error'
        };
    }
  })
  .listen(PORT);

// Connect to MongoDB
connectDB().then(() => {
  console.log(`🚀 Elysia Ecommerce API is running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/docs`);
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

export default app;
