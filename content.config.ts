import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    faq: defineCollection({
      // Specify the type of content in this collection
      type: 'data',
      // Load every file inside the `content` directory
      source: '**/*.yml',
      schema: z.object({
        faq: z.array(z.object({
          question: z.string(),
          answer: z.string()
        }))
      })
    })
  }
})