import { defineCollection, z } from "astro:content";

const postCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		dateFormatted: z.string(),
		topic: z.array(z.string()),
		technologies: z.array(z.string()).optional(),
		views: z.number().default(0).optional(),
	}),
});

export const collections = {
	post: postCollection,
};
