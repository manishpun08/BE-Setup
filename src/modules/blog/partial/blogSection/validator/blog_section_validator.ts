import { z } from 'zod';

export const createBlogSectionValidator = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});
