import { z } from "zod"

export const getWordsSchema = z.object({
	id: z.string(),
	word: z.string(),
	type: z.string(),
})

export type GetWordsDTO = z.infer<typeof getWordsSchema>
