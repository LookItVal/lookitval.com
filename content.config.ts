import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        academicPortfolio: defineCollection({
            type: "page",
            source: "portfolio/academic/*.md",
            schema: z.object({
                color: z.string().optional(),
                image: z.string().optional(),
                rating: z.number()
            })
        }),        
        websitePortfolio: defineCollection({
            type: "page",
            source: "portfolio/website/*.md",
            schema: z.object({
                color: z.string().optional(),
                rating: z.number(),
                image: z.string().optional(),
                URL: z.string().url()
            })
        })
    }
});

                