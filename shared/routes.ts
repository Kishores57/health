import { z } from 'zod';
import { insertBookingSchema, insertTestSchema, testsSchema, bookingsSchema, reportsSchema, type Test, type Booking, type Report } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tests: {
    list: {
      method: 'GET' as const,
      path: '/api/tests' as const,
      responses: {
        200: z.array(testsSchema),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tests/:id' as const,
      responses: {
        200: testsSchema,
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tests' as const,
      input: insertTestSchema,
      responses: {
        201: testsSchema,
        400: errorSchemas.validation,
        401: errorSchemas.internal,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tests/:id' as const,
      input: insertTestSchema.partial(),
      responses: {
        200: testsSchema,
        404: errorSchemas.notFound,
        401: errorSchemas.internal,
      },
    },
  },
  bookings: {
    create: {
      method: 'POST' as const,
      path: '/api/bookings' as const,
      input: insertBookingSchema,
      responses: {
        201: bookingsSchema,
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/bookings' as const, // Admin only usually, or user's bookings
      responses: {
        200: z.array(z.custom<Booking & { tests: Test[] }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/bookings/:id' as const,
      responses: {
        200: z.custom<Booking & { tests: Test[], report: Report | null }>(),
        404: errorSchemas.notFound,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/bookings/:id/status' as const,
      input: z.object({ status: z.enum(["pending", "confirmed", "completed", "cancelled"]) }),
      responses: {
        200: bookingsSchema,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/bookings/:id' as const,
      responses: {
        200: z.object({ message: z.string(), deletedId: z.number() }),
        404: errorSchemas.notFound,
      },
    }
  },
  reports: {
    upload: {
      method: 'POST' as const,
      path: '/api/reports' as const,
      input: z.object({ bookingId: z.number(), reportUrl: z.string() }),
      responses: {
        201: reportsSchema,
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/reports/:id' as const,
      responses: {
        200: reportsSchema,
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
