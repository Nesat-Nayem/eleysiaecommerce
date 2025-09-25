import { Elysia, t } from 'elysia';
import { ProductController } from '../controllers/productController';

export const productRoutes = new Elysia({ prefix: '/api/products' })
  .post('/', async ({ body, set }) => {
    try {
      const result = await ProductController.createProduct(body);
      set.status = 201;
      return result;
    } catch (error: any) {
      set.status = 400;
      return { success: false, message: error.message };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 100 }),
      description: t.String({ minLength: 1, maxLength: 2000 }),
      price: t.Number({ minimum: 0 }),
      category: t.String({ minLength: 1 }),
      brand: t.Optional(t.String()),
      sku: t.String({ minLength: 1 }),
      stock: t.Number({ minimum: 0 }),
      images: t.Optional(t.Array(t.String({ format: 'uri' }))),
      specifications: t.Optional(t.Record(t.String(), t.String())),
      tags: t.Optional(t.Array(t.String())),
      isFeatured: t.Optional(t.Boolean()),
      discount: t.Optional(t.Object({
        type: t.Union([t.Literal('percentage'), t.Literal('fixed')]),
        value: t.Number({ minimum: 0 }),
        startDate: t.Optional(t.String({ format: 'date-time' })),
        endDate: t.Optional(t.String({ format: 'date-time' }))
      }))
    }),
    detail: {
      tags: ['Products'],
      summary: 'Create a new product',
      description: 'Add a new product to the catalog'
    }
  })

  .get('/', async ({ query, set }) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        minPrice, 
        maxPrice, 
        search, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = query;
      
      const result = await ProductController.getAllProducts(
        Number(page),
        Number(limit),
        category,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined,
        search,
        sortBy,
        sortOrder as 'asc' | 'desc'
      );
      return result;
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      category: t.Optional(t.String()),
      minPrice: t.Optional(t.String()),
      maxPrice: t.Optional(t.String()),
      search: t.Optional(t.String()),
      sortBy: t.Optional(t.String()),
      sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')]))
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get all products',
      description: 'Retrieve all products with filtering, searching, and pagination'
    }
  })

  .get('/featured', async ({ query, set }) => {
    try {
      const { limit = 10 } = query;
      const result = await ProductController.getFeaturedProducts(Number(limit));
      return result;
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  }, {
    query: t.Object({
      limit: t.Optional(t.String())
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get featured products',
      description: 'Retrieve featured products'
    }
  })

  .get('/categories', async ({ set }) => {
    try {
      const result = await ProductController.getCategories();
      return result;
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  }, {
    detail: {
      tags: ['Products'],
      summary: 'Get all categories',
      description: 'Retrieve all product categories'
    }
  })

  .get('/category/:category', async ({ params, query, set }) => {
    try {
      const { page = 1, limit = 10 } = query;
      const result = await ProductController.getProductsByCategory(
        params.category,
        Number(page),
        Number(limit)
      );
      return result;
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  }, {
    params: t.Object({
      category: t.String({ minLength: 1 })
    }),
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String())
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get products by category',
      description: 'Retrieve products filtered by category'
    }
  })

  .get('/sku/:sku', async ({ params, set }) => {
    try {
      const result = await ProductController.getProductBySku(params.sku);
      return result;
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  }, {
    params: t.Object({
      sku: t.String({ minLength: 1 })
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get product by SKU',
      description: 'Retrieve a specific product by its SKU'
    }
  })

  .get('/:id', async ({ params, set }) => {
    try {
      const result = await ProductController.getProductById(params.id);
      return result;
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  }, {
    params: t.Object({
      id: t.String({ minLength: 24, maxLength: 24 })
    }),
    detail: {
      tags: ['Products'],
      summary: 'Get product by ID',
      description: 'Retrieve a specific product by its ID'
    }
  })

  .put('/:id', async ({ params, body, set }) => {
    try {
      const result = await ProductController.updateProduct(params.id, body);
      return result;
    } catch (error: any) {
      set.status = 400;
      return { success: false, message: error.message };
    }
  }, {
    params: t.Object({
      id: t.String({ minLength: 24, maxLength: 24 })
    }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
      description: t.Optional(t.String({ minLength: 1, maxLength: 2000 })),
      price: t.Optional(t.Number({ minimum: 0 })),
      category: t.Optional(t.String({ minLength: 1 })),
      brand: t.Optional(t.String()),
      stock: t.Optional(t.Number({ minimum: 0 })),
      images: t.Optional(t.Array(t.String({ format: 'uri' }))),
      specifications: t.Optional(t.Record(t.String(), t.String())),
      tags: t.Optional(t.Array(t.String())),
      isFeatured: t.Optional(t.Boolean()),
      discount: t.Optional(t.Object({
        type: t.Union([t.Literal('percentage'), t.Literal('fixed')]),
        value: t.Number({ minimum: 0 }),
        startDate: t.Optional(t.String({ format: 'date-time' })),
        endDate: t.Optional(t.String({ format: 'date-time' }))
      }))
    }),
    detail: {
      tags: ['Products'],
      summary: 'Update product',
      description: 'Update product information'
    }
  })

  .delete('/:id', async ({ params, set }) => {
    try {
      const result = await ProductController.deleteProduct(params.id);
      return result;
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  }, {
    params: t.Object({
      id: t.String({ minLength: 24, maxLength: 24 })
    }),
    detail: {
      tags: ['Products'],
      summary: 'Delete product',
      description: 'Soft delete a product (deactivate)'
    }
  })

  .patch('/:id/stock', async ({ params, body, set }) => {
    try {
      const { quantity, operation = 'add' } = body;
      const result = await ProductController.updateStock(params.id, quantity, operation);
      return result;
    } catch (error: any) {
      set.status = 400;
      return { success: false, message: error.message };
    }
  }, {
    params: t.Object({
      id: t.String({ minLength: 24, maxLength: 24 })
    }),
    body: t.Object({
      quantity: t.Number({ minimum: 0 }),
      operation: t.Optional(t.Union([t.Literal('add'), t.Literal('subtract')]))
    }),
    detail: {
      tags: ['Products'],
      summary: 'Update product stock',
      description: 'Add or subtract from product stock quantity'
    }
  });
