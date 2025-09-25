import { Product, IProduct } from '../models/Product';

export class ProductController {
  // Create a new product
  static async createProduct(productData: Partial<IProduct>) {
    try {
      const existingProduct = await Product.findOne({ sku: productData.sku });
      if (existingProduct) {
        throw new Error('Product with this SKU already exists');
      }

      const product = new Product(productData);
      await product.save();
      
      return {
        success: true,
        message: 'Product created successfully',
        data: product
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error creating product');
    }
  }

  // Get all products with filtering and pagination
  static async getAllProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    try {
      const skip = (page - 1) * limit;
      
      // Build filter query
      const filter: any = { isActive: true };
      
      if (category) {
        filter.category = new RegExp(category, 'i');
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = minPrice;
        if (maxPrice !== undefined) filter.price.$lte = maxPrice;
      }
      
      if (search) {
        filter.$text = { $search: search };
      }

      // Build sort query
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const products = await Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort);

      const total = await Product.countDocuments(filter);

      return {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching products');
    }
  }

  // Get product by ID
  static async getProductById(id: string) {
    try {
      const product = await Product.findById(id);
      if (!product || !product.isActive) {
        throw new Error('Product not found');
      }

      return {
        success: true,
        data: product
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching product');
    }
  }

  // Get product by SKU
  static async getProductBySku(sku: string) {
    try {
      const product = await Product.findOne({ sku: sku.toUpperCase(), isActive: true });
      if (!product) {
        throw new Error('Product not found');
      }

      return {
        success: true,
        data: product
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching product');
    }
  }

  // Update product
  static async updateProduct(id: string, updateData: Partial<IProduct>) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        throw new Error('Product not found');
      }

      return {
        success: true,
        message: 'Product updated successfully',
        data: product
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error updating product');
    }
  }

  // Delete product (soft delete)
  static async deleteProduct(id: string) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        throw new Error('Product not found');
      }

      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error deleting product');
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 10) {
    try {
      const products = await Product.find({ 
        isActive: true, 
        isFeatured: true 
      })
      .limit(limit)
      .sort({ createdAt: -1 });

      return {
        success: true,
        data: products
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching featured products');
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const products = await Product.find({ 
        category: new RegExp(category, 'i'), 
        isActive: true 
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

      const total = await Product.countDocuments({ 
        category: new RegExp(category, 'i'), 
        isActive: true 
      });

      return {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching products by category');
    }
  }

  // Update product stock
  static async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' = 'add') {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      if (operation === 'add') {
        product.stock += quantity;
      } else {
        if (product.stock < quantity) {
          throw new Error('Insufficient stock');
        }
        product.stock -= quantity;
      }

      await product.save();

      return {
        success: true,
        message: 'Stock updated successfully',
        data: { stock: product.stock }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error updating stock');
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const categories = await Product.distinct('category', { isActive: true });
      
      return {
        success: true,
        data: categories.sort()
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching categories');
    }
  }
}
