import create from "zustand"

interface State {
	article: string
}

export const useArticleStore = create<State>((set) => ({
	article: "",
}))
