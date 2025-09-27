import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { userRoutes } from './routes/userRoutes';
import { productRoutes } from './routes/productRoutes';

export const createApp = () => {
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
        ]
        // Note: No explicit servers array here so it works on both localhost and Vercel
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
            error: (error as any).message
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
    });

  return app;
};
