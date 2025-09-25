# Elysia Ecommerce API

A modern, high-performance ecommerce API built with Elysia.js, TypeScript, and MongoDB. Features comprehensive user and product management with full CRUD operations, authentication, and Swagger documentation.

## 🚀 Features

- **User Management**: Registration, authentication, profile management
- **Product Management**: Full CRUD operations with advanced filtering
- **MongoDB Integration**: Cloud-ready with Mongoose ODM
- **Swagger Documentation**: Interactive API documentation
- **TypeScript**: Full type safety and modern JavaScript features
- **Authentication**: JWT-based authentication system
- **Validation**: Comprehensive input validation with Elysia's type system
- **Error Handling**: Centralized error handling with meaningful responses

## 📋 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- MongoDB Atlas account or local MongoDB instance
- Node.js 18+ (if not using Bun)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd elysia-ecommerce
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your MongoDB credentials:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   ```

## 🚀 Running the Application

### Development Mode
```bash
bun run dev
```

### Production Mode
```bash
bun run start
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## 📚 API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)
- `POST /api/users/:id/change-password` - Change password

### Products
- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products (with filtering and pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/sku/:sku` - Get product by SKU
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)
- `PATCH /api/products/:id/stock` - Update product stock

## 🧪 Testing with Swagger

1. Start the application
2. Navigate to http://localhost:3000/docs
3. Use the interactive Swagger UI to test all endpoints
4. All endpoints include proper validation and error handling

## 📊 Database Schema

### User Schema
```typescript
{
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Schema
```typescript
{
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  images: string[];
  specifications?: Record<string, string>;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: Date;
    endDate?: Date;
  };
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🌐 Deployment Options

### Free Hosting Platforms

1. **Railway** (Recommended)
   - Easy deployment with GitHub integration
   - Automatic HTTPS
   - Environment variable management
   - Free tier available

2. **Render**
   - Free tier with automatic deploys
   - Built-in database hosting
   - Custom domains

3. **Fly.io**
   - Global edge deployment
   - Free allowance
   - Docker-based deployment

4. **Vercel** (Serverless)
   - Excellent for API routes
   - Automatic scaling
   - GitHub integration

### Deployment Steps (Railway Example)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Railway**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Configure Environment Variables**
   - Add all variables from your `.env` file
   - Ensure MongoDB URI is accessible from the internet

## 🛠️ Development

### Project Structure
```
src/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   ├── userController.ts    # User business logic
│   └── productController.ts # Product business logic
├── models/
│   ├── User.ts             # User schema
│   └── Product.ts          # Product schema
├── routes/
│   ├── userRoutes.ts       # User endpoints
│   └── productRoutes.ts    # Product endpoints
└── index.ts                # Main application file
```

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Register routes in `src/index.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the Swagger documentation at `/docs`
2. Review the error messages in the API responses
3. Check the server logs for detailed error information
4. Ensure your MongoDB connection is properly configured

## 🔄 Version History

- **v1.0.0** - Initial release with User and Product modules
  - Full CRUD operations
  - JWT authentication
  - Swagger documentation
  - MongoDB integration
