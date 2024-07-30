import { useRequest } from "ahooks"

import { getArticles } from "../actions"

import { showErrorToast } from "@/components/ui/toast"

export const useGetArticles = () => {
	return useRequest(getArticles, {
		loadingDelay: 300,

		onError(error) {
			showErrorToast(`获取文章失败：${error.message}`)
		},
	})
}
