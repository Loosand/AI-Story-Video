import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Layout({ children }: { children: React.ReactNode }) {
	return <div className="container mx-auto py-20">{children}</div>
}
