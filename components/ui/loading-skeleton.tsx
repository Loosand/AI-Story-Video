import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function LoadingSkeleton({ className }: { className?: string }) {
	return (
		<div className={(cn("w-fit mx-auto"), className)}>
			<span className="flex items-center gap-2 text-gray-500">
				<Loader2 className="size-4 animate-spin" />
				loading...
			</span>
		</div>
	)
}
