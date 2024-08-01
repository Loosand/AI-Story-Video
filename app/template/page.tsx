"use client"

import { useRef, useState } from "react"

export default function Home() {
	const [recording, setRecording] = useState<boolean>(false)
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
	const [videoUrl, setVideoUrl] = useState<string>("")
	const videoRef = useRef<HTMLVideoElement>(null)

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

	return (
		<div>
			<h1>Screen Recorder</h1>
			<button onClick={recording ? stopRecording : startRecording}>
				{recording ? "Stop Recording" : "Start Recording"}
			</button>
			{videoUrl && <video ref={videoRef} src={videoUrl} controls autoPlay />}
		</div>
	)
}
