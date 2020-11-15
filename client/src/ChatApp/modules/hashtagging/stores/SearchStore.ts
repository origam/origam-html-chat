import { action, observable } from "mobx";
import { HashtagRootStore } from "./RootStore";

export class SearchStore {
  constructor(public root: HashtagRootStore) {}

  get screenProcess() {
    return this.root.screenProcess;
  }

  @observable _spCategories: string = "";
  @observable _spObjects: string = "";

  @action.bound handleSPCategoriesChange(event: any) {
    this._spCategories = event.target.value;
    this.screenProcess.handleCategorySearchChange(this._spCategories);
  }

  @action.bound handleSPObjectsChange(event: any) {
    this._spObjects = event.target.value;
    this.screenProcess.handleObjectSearchChange(this._spObjects);
  }

  get spCategories() {
    return this._spCategories;
  }

  get spObjects() {
    return this._spObjects;
  }
}
