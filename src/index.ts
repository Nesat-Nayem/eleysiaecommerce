import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { connectDB } from './config/database';
import { userRoutes } from './routes/userRoutes';
import { productRoutes } from './routes/productRoutes';

// Load environment variables - Railway provides PORT dynamically
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

console.log(`🔧 Starting server on ${HOST}:${PORT}`);

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
          url: process.env.NODE_ENV === 'production' 
            ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost'}`
            : `http://localhost:${PORT}`,
          description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
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
    },
    environment: process.env.NODE_ENV || 'development'
  }))
  .get('/health', () => ({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    host: HOST
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
  });

// Start server after database connection
async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Then start the server
    app.listen({
      port: PORT,
      hostname: HOST
    });
    
    console.log(`🚀 Elysia Ecommerce API is running at http://${HOST}:${PORT}`);
    console.log(`📚 API Documentation available at http://${HOST}:${PORT}/docs`);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

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
