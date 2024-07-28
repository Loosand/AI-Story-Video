"use server"

import { prisma } from "@/lib/prisma"

export const isWordExist = async (id: string): Promise<boolean> => {
	const isExist = await prisma.sensitiveword.findUnique({ where: { id } })
	return Boolean(isExist)
}

export const getWords = async () => {
	try {
		const words = await prisma.sensitiveword.findMany()
		console.log("Fetched words:", words) // 打印查询结果
		return words
	} catch (error) {
		console.error("Error fetching words:", error) // 打印错误信息
		throw error
	}
}

export const deleteWord = async (id: string) => {
	const deletedWord = await prisma.sensitiveword.delete({
		where: { id },
	})
	return deletedWord
}

export const addWord = async (word: string) => {
	const newWord = await prisma.sensitiveword.create({
		data: {
			word: word,
		},
	})
	return newWord
}
