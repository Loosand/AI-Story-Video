import { useRequest } from "ahooks"

import { getWords } from "../actions"

import { showErrorToast, showSuccessToast } from "@/components/ui/toast"

export const useGetWords = () => {
	return useRequest(getWords, {
		loadingDelay: 300,

		onError(error) {
			showErrorToast(`获取敏感词失败：${error.message}`)
		},
	})
}
