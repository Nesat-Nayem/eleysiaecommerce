import { Elysia, t } from 'elysia';
import { UserController } from '../controllers/userController';

export const userRoutes = new Elysia({ prefix: '/api/users' })
  .post('/register', async ({ body, set }: any) => {
    try {
      const result = await UserController.createUser(body);
      set.status = 201;
      return result;
    } catch (error: any) {
      set.status = 400;
      return { success: false, message: error.message };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 50 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
      role: t.Optional(t.Union([t.Literal('user'), t.Literal('admin')])),
      phone: t.Optional(t.String()),
      address: t.Optional(t.Object({
        street: t.String(),
        city: t.String(),
        state: t.String(),
        zipCode: t.String(),
        country: t.String()
      }))
    }),
    detail: {
      tags: ['Users'],
      summary: 'Register a new user',
      description: 'Create a new user account'
    }
  })

  .post('/login', async ({ body, set }: any) => {
    try {
      const { email, password } = body;
      const result = await UserController.loginUser(email, password);
      return result;
    } catch (error: any) {
      set.status = 401;
      return { success: false, message: error.message };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 1 })
    }),
    detail: {
      tags: ['Users'],
      summary: 'User login',
      description: 'Authenticate user and return JWT token'
    }
  })

  .get('/', async ({ query, set }: any) => {
    try {
      const { page = 1, limit = 10 } = query;
      const result = await UserController.getAllUsers(Number(page), Number(limit));
      return result;
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String())
    }),
    detail: {
      tags: ['Users'],
      summary: 'Get all users',
      description: 'Retrieve all active users with pagination'
    }
  })

  .get('/:id', async ({ params, set }: any) => {
    try {
      const result = await UserController.getUserById(params.id);
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
      tags: ['Users'],
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their ID'
    }
  })

  .put('/:id', async ({ params, body, set }: any) => {
    try {
      const result = await UserController.updateUser(params.id, body);
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
      name: t.Optional(t.String({ minLength: 1, maxLength: 50 })),
      email: t.Optional(t.String({ format: 'email' })),
      role: t.Optional(t.Union([t.Literal('user'), t.Literal('admin')])),
      phone: t.Optional(t.String()),
      address: t.Optional(t.Object({
        street: t.String(),
        city: t.String(),
        state: t.String(),
        zipCode: t.String(),
        country: t.String()
      }))
    }),
    detail: {
      tags: ['Users'],
      summary: 'Update user',
      description: 'Update user information'
    }
  })

  .delete('/:id', async ({ params, set }: any) => {
    try {
      const result = await UserController.deleteUser(params.id);
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
      tags: ['Users'],
      summary: 'Delete user',
      description: 'Soft delete a user (deactivate)'
    }
  })

  .post('/:id/change-password', async ({ params, body, set }: any) => {
    try {
      const { currentPassword, newPassword } = body;
      const result = await UserController.changePassword(params.id, currentPassword, newPassword);
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
      currentPassword: t.String({ minLength: 1 }),
      newPassword: t.String({ minLength: 6 })
    }),
    detail: {
      tags: ['Users'],
      summary: 'Change password',
      description: 'Change user password'
    }
  });
