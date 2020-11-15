import { createContext, useContext } from "react";
import { HashtagRootStore } from "../stores/RootStore";

export const CtxHashtagRootStore = createContext<HashtagRootStore>(null!);

export function useRootStore() {
  return useContext(CtxHashtagRootStore);
}
