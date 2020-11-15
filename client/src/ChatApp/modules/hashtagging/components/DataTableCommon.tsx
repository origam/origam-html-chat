import { createContext, useContext } from "react";
import { useRootStore } from "./Common";

export const CtxEntityId = createContext<string | null>(null);

export function useEntityId() {
  return useContext(CtxEntityId);
}

export function useDataTable() {
  const { dataTableStore } = useRootStore();
  const entityId = useEntityId();
  return entityId ? dataTableStore.getDataTable(entityId) : null;
}
