"use client"

import { useRef, useState } from "react"
import { Moon, Sun, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function StoryPage() {
	// const [videoUrl, setVideoUrl] = useState("")
	const [recording, setRecording] = useState<boolean>(false)
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
	const [videoUrl, setVideoUrl] = useState<string>("")
	const videoRef = useRef<HTMLVideoElement>(null)
	const [startScroll, setStartScroll] = useState(false)

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			} as MediaStreamConstraints)

			const recorder = new MediaRecorder(stream)
			let chunks: Blob[] = []

			recorder.ondataavailable = (event: BlobEvent) => {
				if (event.data.size > 0) {
					chunks.push(event.data)
				}
			}

			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: "video/webm" })
				const url = URL.createObjectURL(blob)
				setVideoUrl(url)
				const a = document.createElement("a")
				a.style.display = "none"
				a.href = url
				a.download = "recording.webm"
				document.body.appendChild(a)
				a.click()
				window.URL.revokeObjectURL(url)
			}

			recorder.start()
			setMediaRecorder(recorder)
			setRecording(true)
		} catch (err) {
			console.error("Error: " + err)
		}
	}

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop()
			setRecording(false)
		}
	}

	const [mode, setMode] = useState("90deg")
	const [from, setFrom] = useState(
		`${getRandomColorValue(100)},${getRandomColorValue(
			100
		)},${getRandomColorValue(100)}`
	)
	const [to, setTo] = useState(
		`${getRandomColorValue(200)},${getRandomColorValue(
			200
		)},${getRandomColorValue(200)}`
	)

	// const startRecording = async () => {
	// 	const response = await fetch("/api/record")
	// 	const data = await response.json()
	// 	setVideoUrl(data.videoPath)
	// }

	function getRandomColorValue(number: number) {
		return Math.floor(Math.random() * 21) + number // 生成200到220之间的随机数
	}

	function randomDeepBackground() {
		setMode(Math.random() > 0.5 ? "circle" : "180deg")
		setFrom(
			`${getRandomColorValue(100)},${getRandomColorValue(
				100
			)},${getRandomColorValue(100)}`
		)
		setTo(
			`${getRandomColorValue(200)},${getRandomColorValue(
				200
			)},${getRandomColorValue(200)}`
		)
	}

	function randomShallowBackground() {
		setMode(Math.random() > 0.5 ? "circle" : "180deg")
		setFrom(
			`${getRandomColorValue(200)},${getRandomColorValue(
				200
			)},${getRandomColorValue(200)}`
		)
		setTo(
			`${getRandomColorValue(230)},${getRandomColorValue(
				230
			)},${getRandomColorValue(230)}`
		)
	}

	return (
		<>
			<div
				style={{
					background: `${
						mode == "circle" ? "radial" : "linear"
					}-gradient(${mode}, rgba(${from},1) 0%, rgba(${to},1) 100%)`,
				}}
				className="relative h-screen w-[500px] space-y-10 overflow-hidden px-20">
				<div className="pt-14">
					<div className="text-shadow-pink z-50 mx-auto h-fit rounded-full bg-white px-10 py-3 text-center text-5xl font-bold text-white outline outline-black">
						赔罪自拍
					</div>
				</div>

				<div
					className={cn("space-y-10 pt-40", {
						"animate-scroll-infinite": startScroll,
					})}>
					<section className="space-y-5 indent-10 text-xl font-bold leading-loose">
						<p>
							我是圈里有名的花瓶女明星，出道两年时间，拍了几部偶像剧，但都是戏份不多的女配角，稳坐花瓶美人称号。
						</p>
						<p>
							这并不是因为我演技不够好，也不是因为我身后没有大腿可抱，是因为大腿的醋劲儿太大了，不仅没有给我的演艺事业形成正面影响，反而一直在拉我的后腿。
						</p>
						<p>黎文曜这个醋坛子，接受不了我现代偶像剧的任何亲密戏份。</p>
						<p>于是，所有我能凭颜值接到的戏份都被尺度给打了回去。</p>
						<p>小说内容蹉跎了两年多，经纪人终于灵机一动</p>
						<p>
							我是圈里有名的花瓶女明星，出道两年时间，拍了几部偶像剧，但都是戏份不多的女配角，稳坐花瓶美人称号。
						</p>
						<p>
							这并不是因为我演技不够好，也不是因为我身后没有大腿可抱，是因为大腿的醋劲儿太大了，不仅没有给我的演艺事业形成正面影响，反而一直在拉我的后腿。
						</p>
						<p>黎文曜这个醋坛子，接受不了我现代偶像剧的任何亲密戏份。</p>
						<p>于是，所有我能凭颜值接到的戏份都被尺度给打了回去。</p>
						<p>小说内容蹉跎了两年多，经纪人终于灵机一动</p>
						<p>
							我是圈里有名的花瓶女明星，出道两年时间，拍了几部偶像剧，但都是戏份不多的女配角，稳坐花瓶美人称号。
						</p>
						<p>
							这并不是因为我演技不够好，也不是因为我身后没有大腿可抱，是因为大腿的醋劲儿太大了，不仅没有给我的演艺事业形成正面影响，反而一直在拉我的后腿。
						</p>
						<p>黎文曜这个醋坛子，接受不了我现代偶像剧的任何亲密戏份。</p>
						<p>于是，所有我能凭颜值接到的戏份都被尺度给打了回去。</p>
						<p>小说内容蹉跎了两年多，经纪人终于灵机一动</p>
						<p>
							我是圈里有名的花瓶女明星，出道两年时间，拍了几部偶像剧，但都是戏份不多的女配角，稳坐花瓶美人称号。
						</p>
						<p>
							这并不是因为我演技不够好，也不是因为我身后没有大腿可抱，是因为大腿的醋劲儿太大了，不仅没有给我的演艺事业形成正面影响，反而一直在拉我的后腿。
						</p>
						<p>黎文曜这个醋坛子，接受不了我现代偶像剧的任何亲密戏份。</p>
						<p>于是，所有我能凭颜值接到的戏份都被尺度给打了回去。</p>
						<p>小说内容蹉跎了两年多，经纪人终于灵机一动</p>
						<p>
							我是圈里有名的花瓶女明星，出道两年时间，拍了几部偶像剧，但都是戏份不多的女配角，稳坐花瓶美人称号。
						</p>
						<p>
							这并不是因为我演技不够好，也不是因为我身后没有大腿可抱，是因为大腿的醋劲儿太大了，不仅没有给我的演艺事业形成正面影响，反而一直在拉我的后腿。
						</p>
						<p>黎文曜这个醋坛子，接受不了我现代偶像剧的任何亲密戏份。</p>
						<p>于是，所有我能凭颜值接到的戏份都被尺度给打了回去。</p>
						<p>小说内容蹉跎了两年多，经纪人终于灵机一动</p>
					</section>
				</div>

				<span className="text-shadow absolute bottom-4 right-4 text-white">
					*本故事纯属虚构
				</span>
			</div>

			<div className="fixed left-0 top-0 p-5">
				<div className="flex flex-col gap-4">
					<Button
						className="hover:bg-current/85 bg-sky-800 px-10 py-6"
						onClick={() => randomDeepBackground()}>
						<Moon className="mr-2 size-4" />
						切换深色背景
					</Button>
					<Button
						className="hover:bg-current/85 bg-sky-100 px-10 py-6 text-black"
						onClick={() => randomShallowBackground()}>
						<Sun className="mr-2 size-4" />
						切换浅色背景
					</Button>

					<Button
						variant="outline"
						onClick={() => setStartScroll(!startScroll)}>
						{startScroll ? "停止滚动" : "开始滚动"}
					</Button>

					<Button
						onClick={recording ? stopRecording : startRecording}
						variant={recording ? "destructive" : "default"}>
						<Play className="mr-2 size-4" />
						{recording ? "停止录制" : "开始录制"}
					</Button>

					{videoUrl && (
						<video ref={videoRef} src={videoUrl} controls autoPlay />
					)}
				</div>
			</div>
		</>
	)
}
