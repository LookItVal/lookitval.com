import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        home: defineCollection({
            type: "page",
            source: "home.md",
            schema: z.object({
                title: z.string(),
                descrtiption: z.string()
            })
        }),
        portfolioPage: defineCollection({
            type: "page",
            source: "portfolio/*.md",
            schema: z.object({
                title: z.string(),
                collection: z.string(),
                dynamicColor: z.string(),
                staticColor: z.string(),
                visible: z.boolean().default(true)
            })
        }),
        academicPortfolio: defineCollection({
            type: "page",
            source: "portfolio/academic/*.md",
            schema: z.object({
                color: z.string().optional(),
                image: z.string().optional(),
                rating: z.number(),
                URL: z.string().url().optional(),
                visible: z.boolean().default(true)
            })
        }),        
        websitePortfolio: defineCollection({
            type: "page",
            source: "portfolio/website/*.md",
            schema: z.object({
                color: z.string().optional(),
                rating: z.number(),
                image: z.string().optional(),
                URL: z.string().url(),
                visible: z.boolean().default(true)
            })
        }),
        audioPortfolio: defineCollection({
            type: "page",
            source: "portfolio/audio/*.md",
            schema: z.object({
                title: z.string(),
                color: z.string().optional(),
                image: z.string().optional(),
                rating: z.number(),
                URL: z.string().url().optional(),
                visible: z.boolean().default(true)
            })
        })
    }
});

                