import { WindowsSvc } from "../../../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../../../services/ChatHTTPApi";
import { APIService } from "../services/APIService";
import { ScreenProcess } from "../services/ScreenProcess";
import { DataTableStore } from "./DataTableStore";
import { SearchStore } from "./SearchStore";

export class HashtagRootStore {
  constructor(public windowsSvc: WindowsSvc, public httpApi: ChatHTTPApi) {}
  apiService = new APIService(this);
  screenProcess = new ScreenProcess(this, this.windowsSvc);
  dataTableStore = new DataTableStore(this);
  searchStore = new SearchStore(this);
}
