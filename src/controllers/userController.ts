import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export class UserController {
  // Create a new user
  static async createUser(userData: Partial<IUser>) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = new User(userData);
      await user.save();
      
      return {
        success: true,
        message: 'User created successfully',
        data: user
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error creating user');
    }
  }

  // Get all users
  static async getAllUsers(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find({ isActive: true })
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments({ isActive: true });

      return {
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching users');
    }
  }

  // Get user by ID
  static async getUserById(id: string) {
    try {
      const user = await User.findById(id).select('-password');
      if (!user || !user.isActive) {
        throw new Error('User not found');
      }

      return {
        success: true,
        data: user
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching user');
    }
  }

  // Update user
  static async updateUser(id: string, updateData: Partial<IUser>) {
    try {
      // Remove password from update data if present
      const { password, ...safeUpdateData } = updateData;

      const user = await User.findByIdAndUpdate(
        id,
        safeUpdateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        message: 'User updated successfully',
        data: user
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error updating user');
    }
  }

  // Delete user (soft delete)
  static async deleteUser(id: string) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error deleting user');
    }
  }

  // Login user
  static async loginUser(email: string, password: string) {
    try {
      const user = await User.findOne({ email, isActive: true }).select('+password');
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error during login');
    }
  }

  // Change password
  static async changePassword(id: string, currentPassword: string, newPassword: string) {
    try {
      const user = await User.findById(id).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error changing password');
    }
  }
}
