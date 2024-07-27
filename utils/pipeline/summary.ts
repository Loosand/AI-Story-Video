import fs from "fs"
import path from "path"

import { PrismaClient } from "@prisma/client"
// import Handlebars from "handlebars"
import OpenAI from "openai"
import puppeteer, { ElementHandle } from "puppeteer"
import dotenv from "dotenv"

dotenv.config()

if (process.env.API_KEY === undefined || process.env.API_URL === undefined) {
	throw new Error("API_KEY 或 API_URL 未在 .env 中设置，请检查环境变量是否正确")
}

const openai = new OpenAI({
	baseURL: process.env.API_URL,
	apiKey: process.env.API_KEY,
})
/**
 * 生成日报数据
 */

const prisma = new PrismaClient()

// async function generateDailyReportData() {
// 	const today = new Date()
// 	console.log("正在尝试从数据库获取数据...")
// 	const tweets = await prisma.tweet.findMany({
// 		where: {
// 			created_at: {
// 				gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
// 				lt: new Date(
// 					today.getFullYear(),
// 					today.getMonth(),
// 					today.getDate() + 1
// 				),
// 			},
// 		},
// 	})
//
// 	const tweetData = JSON.stringify(tweets)
// 	console.log(
// 		`获取到今日日期为 ${today.toISOString().split("T")[0]} 的推文数据，共 ${
// 			tweets.length
// 		} 条。`
// 	)
//
// 	if (tweetData.length === 0) {
// 		console.log("没有获取到数据，请检查数据库是否正常")
// 		console.log("停止生成日报")
// 		return
// 	}
//
// 	const systemGeneralPrompt = `
//         你是一个善于阅读总结信息的阅读者，并且在AI相关领域颇有建树。你熟稔AI领域的各种基本概念，关注了大多数AI领域内的专家大牛的推特账号。
//         你的任务是，根据用户传入的推文数据(这些推文可能存在 原创推文、引用推文、纯转发等 多种情况)，对于推文内容涉及的相似领域内容，总结成领域的今日热点内容。
//
//         对于你的任务，你需要注意的是：
//
//         如果该推文是推荐了某项工具、研究进展或某个项目，如果相应的工具、研究内容或项目存在外部链接，你可以在文本内容中提取出相应的链接内容。
//         理清楚推文数据的关系。对于 quoteTweet 与 refTweet 类的数据项，如果相关数据内容为""，则说明不存在相应的推文数据项。
//         推文数据中的 tweetId 可以通过与 tweetAuthorAtId 结合，以形如 'https://x.com/{tweetAuthorAtId}/status/{tweetId}' 的形式获取原始推文的网页链接，quoteTweet 与 refTweet 同理。
//         对于最后返回的内容，有以下格式化要求：
//
//         以JSON形式返回，JSON包含的字段有：
//         summmary，用于总结今日领域概况，这段内容应当详细、言简意赅，减少无意义的修辞，生成内容控制在300字-400字之间。这段内容的语言可以稍微风趣幽默点，比如以“今天是XXX的一天”开头。
//         keywords，用于总结今日领域概况的关键词，该关键词应该围绕热点内容生成，每个关键词应该控制在 10个字以内，关键词的数量控制在6个以内。
//         hotspot，用于总结今日热点内容。该热点内容由 topic 、content 和 link 组成。其中 topic 是热点的关键词， 它应该和关键词相对应。content 是对热点的描述内容，描述内容应该说清楚谁在该热点内容中有了什么行为。link是相关推文的链接，它应该是一个JSON中的字符串数组。
//         reference，用于提供推文中存在的参考链接。该内容由 link 和 description 组成。其中，link 用于保存可访问的外链信息，description用于介绍该外链内容的重点总结。
//         token，本次交互花费的token数量。
//         内容应该是中文。
//
//         不需要返回原始的推文内容。
//     `
//
// 	console.log("正在尝试从 openai 获取数据")
//
// 	const chatCompletion = await openai.chat.completions.create({
// 		messages: [
// 			{
// 				role: "system",
// 				content: systemGeneralPrompt,
// 			},
// 			{
// 				role: "user",
// 				content: tweetData,
// 			},
// 		],
// 		model: "gpt-4o",
// 	})
//
// 	console.log(chatCompletion.choices[0].message.content)
// 	const resultData = chatCompletion.choices[0].message.content
//
// 	if (resultData === undefined || resultData === null) {
// 		console.log("获取数据失败，请检查数据是否正确")
// 		return
// 	}
//
// 	console.log("正在尝试从OpenAI获取的数据进行结构化...")
//
// 	const cleanedJsonString = resultData.replace(/```json|```/g, "").trim()
//
// 	try {
// 		const jsonData = JSON.parse(cleanedJsonString)
// 		console.log("成功结构化了结果数据")
// 		fs.writeFileSync("./output/latest.json", JSON.stringify(jsonData, null, 2))
// 		fs.writeFileSync(
// 			`./output/dailt_${today.toISOString().split("T")[0]}.json`,
// 			JSON.stringify(jsonData, null, 2)
// 		)
// 	} catch (error) {
// 		console.error("Failed to parse JSON:", error)
// 		console.error("结构化结果数据失败")
// 	}
// }
//
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
