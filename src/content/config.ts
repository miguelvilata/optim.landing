import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Equipo Optim'),
    lang: z.enum(['es', 'en', 'pt']),
    tags: z.array(z.string()).default([]),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    draft: z.boolean().default(false),
    translations: z
      .object({
        es: z.string().nullable().optional(),
        en: z.string().nullable().optional(),
        pt: z.string().nullable().optional(),
      })
      .optional(),
  }),
});

export const collections = { blog };
