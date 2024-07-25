"use client"

import { useState } from "react"

import { BytemdEditor } from "@/components/bytemd"

export function EditArticlePage() {
	const [content, setContent] = useState("content")

	return (
		<div>
			<h1>Edit Article</h1>

			<div id="content-editor">
				<BytemdEditor body={content} setContent={setContent} />
			</div>
		</div>
	)
}
