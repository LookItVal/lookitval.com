import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        entry: defineCollection({
            type: "page",
            source: "portfolio/academic/*.md",
            schema: z.object({
                color: z.string().optional(),
                image: z.string().optional()
            })
        })
    }
});

                