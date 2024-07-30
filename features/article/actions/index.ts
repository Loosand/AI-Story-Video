"use server"

import { prisma } from "@/lib/prisma"

export const isArticleExist = async (id: string): Promise<boolean> => {
	const isExist = await prisma.article.findUnique({ where: { id } })
	return Boolean(isExist)
}

export const addArticle = async (
	title: string,
	description: string,
	type: string,
	content: string
): Promise<void> => {
	await prisma.article.create({
		data: {
			title,
			description,
			type,
			content,
			status: "draft", // Assuming the default status is "draft"
		},
	})
}

export const deleteArticle = async (id: string): Promise<void> => {
	await prisma.article.delete({ where: { id } })
}

export const getArticle = async (id: string) => {
	if (!id) {
		throw new Error("Invalid ID parameter")
	}

	const article = await prisma.article.findUnique({ where: { id } })
	return article
}

export const getArticles = async (sortBy: "asc" | "desc" = "desc") => {
	const articles = await prisma.article.findMany({
		orderBy: { created_at: sortBy },
	})
	return articles
}

export const updateArticle = async (
	id: string,
	title: string,
	description: string,
	type: string,
	content: string
	// status: string
): Promise<void> => {
	await prisma.article.update({
		where: { id },
		data: {
			title,
			description,
			type,
			content,
			status: "draft", // Assuming the default status is "draft"
		},
	})
}
