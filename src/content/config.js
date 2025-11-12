import { defineCollection, z } from "astro:content";

const postCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		dateFormatted: z.string(),
		topic: z.array(z.string()),
		technologies: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		hidden: z.boolean().optional().default(false),
		image: z.string().optional(),
	}),
});

export const collections = {
	post: postCollection,
};
