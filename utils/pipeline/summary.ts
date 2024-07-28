"use server"

import fs from "fs"
import path from "path"

import { PrismaClient } from "@prisma/client"
// import Handlebars from "handlebars"
import OpenAI from "openai"
import puppeteer, { ElementHandle } from "puppeteer"
import dotenv from "dotenv"

import { ArticleData } from "@/features/article"

dotenv.config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

if (process.env.API_KEY === undefined || process.env.API_URL === undefined) {
	throw new Error("API_KEY 或 API_URL 未在 .env 中设置，请检查环境变量是否正确")
}

const openai = new OpenAI({
	baseURL: process.env.API_URL,
	apiKey: process.env.API_KEY,
})

const prisma = new PrismaClient()

export async function generateArticleData({
	article,
}: {
	article: string
}): Promise<string | undefined> {
	const articleData = JSON.stringify(article)

	if (!article) {
		console.log("文章数据为空，请检查数据是否正确")
		return
	}

	const systemGeneralPrompt = `
      你是一个善于阅读总结信息的阅读者，并且在小说相关领域颇有建树。你熟稔小说领域的各种基本概念，知道大多数小说类型。
			你的任务是，根据用户传入的小说原文，对于小说内容，总结(4、6)标题各两个，并为该小说生成20字左右的简略内容，并告诉我该小说的类型。

			对于你的任务，你需要注意的是：

			对于最后返回的内容，有以下格式化要求：

			1. 以JSON形式返回，JSON包含的字段有：
			- summmary，用于小说的简略内容总结，这段内容应当详细、言简意赅，减少无意义的修辞，生成内容控制在15字-30字之间。
			- titles，数组类型，用于生成该小说的标题，该标题应该围绕小说内容生成，分别生成4字、6字标题各两个。
			- types，数组类型，用于生成小说的风格类型，小说类型有：言情,现代,男女,虐文,古风,女频,修仙,古代,男频，最多可以给小说生成两个类型，最少一个。
			- token，本次交互花费的token数量。
			2. 内容应该是中文。
			3. 不需要返回原始的小说内容。
    `

	console.log("正在尝试从 openai 获取数据")

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: "system",
				content: systemGeneralPrompt,
			},
			{
				role: "user",
				content: articleData,
			},
		],
		model: "gpt-4o",
	})

	const resultData = chatCompletion.choices[0].message.content
	console.log(resultData)

	if (resultData === undefined || resultData === null) {
		console.log("获取数据失败，请检查数据是否正确")
		return
	}

	console.log("正在尝试从OpenAI获取的数据进行结构化...")

	const cleanedJsonString = resultData.replace(/```json|```/g, "").trim()

	try {
		const jsonData = JSON.parse(cleanedJsonString)

		console.log("成功结构化了结果数据:", jsonData)
		return JSON.stringify(jsonData, null, 2)
	} catch (error) {
		console.error("Failed to parse JSON:", error)
		console.error("结构化结果数据失败")
		return
	}
}

// export async function generateDailyReportDataPicture() {
// 	const data = JSON.parse(
// 		fs.readFileSync("./output/latest.json", { encoding: "utf-8" })
// 	)
//
// 	const templatePath = path.join("./", "./template/default.html")
// 	const templateSource = fs.readFileSync(templatePath, "utf-8")
// 	const qrcodeBase64 = fs
// 		.readFileSync("./assets/qrcode-sample.jpg")
// 		.toString("base64")
//
// 	console.log("正在尝试生成日报图片...")
//
// 	// 编译 Handlebars 模板
// 	const template = Handlebars.compile(templateSource)
//
// 	// 生成 HTML 内容
// 	const htmlContent = template({ ...data, qrcodeBase64 })
//
// 启动 Puppeteer 并生成图片
// 	const browser = await puppeteer.launch({
// 		args: ["--no-sandbox", "--disable-setuid-sandbox"],
// 	})
// 	const page = await browser.newPage()
// 	await page.setContent(htmlContent, { waitUntil: "networkidle0" })
//
// 	// 获取页面内容的高度
// 	// const bodyHandle = await page.$('body') as ElementHandle<HTMLBodyElement>;
// 	// await bodyHandle.dispose();
//
// 	// await bodyHandle.screenshot({
// 	//     path: './output/output.png',
// 	//     fullPage:true
// 	// })
//
// 	// 截取整个页面
// 	await page.screenshot({ path: "./output/latest_output.png", fullPage: true })
// 	await page.screenshot({
// 		path: `./output/${new Date().toISOString().split("T")[0]}.png`,
// 		fullPage: true,
// 	})
//
// 	await browser.close()
// 	console.log("成功生成日报图片")
// }
//
// export const dailytPipeLine = async () => {
// 	try {
// 		await generateDailyReportData()
// 		await generateDailyReportDataPicture()
// 		fs.writeFileSync("./output/status.json", JSON.stringify({ status: "OK" }))
// 	} catch (error) {
// 		fs.writeFileSync(
// 			"./output/status.json",
// 			JSON.stringify({ status: `At daily picture summon service:${error}` })
// 		)
// 	}
// }
