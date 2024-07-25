import { useRequest } from "ahooks"

import { addWord } from "../actions"

import { showErrorToast, showSuccessToast } from "@/components/ui/toast"

export const useAddWord = () => {
	return useRequest(addWord, {
		manual: true,
		loadingDelay: 300,
		onSuccess() {
			showSuccessToast("敏感词添加成功")
		},
		onError(error) {
			showErrorToast(`添加敏感词失败：${error.message}`)
		},
	})
}
