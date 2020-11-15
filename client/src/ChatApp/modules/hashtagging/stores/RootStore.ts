import { WindowsSvc } from "../../../components/Windows/WindowsSvc";
import { APIService } from "../services/APIService";
import { ScreenProcess } from "../services/ScreenProcess";
import { DataTableStore } from "./DataTableStore";
import { SearchStore } from "./SearchStore";

const apiService = new APIService();

export class HashtagRootStore {
  constructor(public windowsSvc: WindowsSvc) {}

  apiService = apiService;
  screenProcess = new ScreenProcess(this, apiService, this.windowsSvc);
  dataTableStore = new DataTableStore(this);
  searchStore = new SearchStore(this);
}
