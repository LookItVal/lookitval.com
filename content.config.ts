import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'


type Section = {
  name: string
  url: string
  sections?: Section[]
}

const SectionSchema: z.ZodType<Section> = z.object({
  name: z.string(),
  url: z.string(),
  sections: z.array(z.lazy(() => SectionSchema)).optional()
}).strict()

export default defineContentConfig({
  collections: {
    faq: defineCollection({
      // Specify the type of content in this collection
      type: 'data',
      // Load every file inside the `content` directory
      source: '**/faq.yml',
      schema: z.object({
        faq: z.array(z.object({
          question: z.string(),
          answer: z.string()
        }))
      })
    }),

    caseStudies: defineCollection({
      type: 'data',
      source: 'case-studies/**/*.yml',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        sections: z.array(SectionSchema)
      }).strict()
    }),

    caseStudyPages: defineCollection({
      type: 'page',
      source: 'case-studies/**/*.md'
    })
  }
})