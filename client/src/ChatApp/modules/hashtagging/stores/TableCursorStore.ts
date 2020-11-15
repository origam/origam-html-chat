import { action, observable } from "mobx";

export class TableCursor {
  constructor() {}

  @observable selectedRowId?: string = "";

  @action.bound setSelectedRowId(rowId: string | undefined) {
    this.selectedRowId = rowId;
  }
}
