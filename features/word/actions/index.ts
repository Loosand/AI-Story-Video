"use server"

import { type Prisma } from "@prisma/client"

import { GetWordsDTO, getWordsSchema } from "../types"

import { prisma } from "@/lib/prisma"

export const isWordExist = async (id: string): Promise<boolean> => {
	const isExist = await prisma.sensitiveWord.findUnique({ where: { id } })
	return Boolean(isExist)
}

export const getWords = async () => {
	try {
		const words = await prisma.sensitiveWord.findMany()
		console.log("Fetched words:", words) // 打印查询结果
		return words
	} catch (error) {
		console.error("Error fetching words:", error) // 打印错误信息
		throw error
	}
}

export const deleteWord = async (id: string) => {
	const deletedWord = await prisma.sensitiveWord.delete({
		where: { id },
	})
	return deletedWord
}

export const addWord = async (word: string) => {
	const newWord = await prisma.sensitiveWord.create({
		data: {
			word,
		},
	})
	return newWord
}
