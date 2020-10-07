import { takeRight } from "lodash";
import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";
import { renderRenameChatroomDialog } from "../components/Dialogs/RenameChatroomDialog";
import {
  renderSimpleInformation,
  renderSimpleProgres,
} from "../components/Windows/Windows";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import { TransportSvc } from "../services/TransportSvc";

export class RenameChatroomWorkflow {
  constructor(
    public windowsSvc: WindowsSvc,
    public api: ChatHTTPApi,
    public transportSvc: TransportSvc
  ) {}

  async start() {
    const renameChatroomDialog = this.windowsSvc.push(
      renderRenameChatroomDialog()
    );
    try {
      while (true) {
        try {
          const renameChatroomDialogResult = await renameChatroomDialog.interact();
          if (renameChatroomDialogResult.isCancel) {
            return;
          }
          if (!renameChatroomDialogResult.chatroomTopic) {
            const infoDialog = this.windowsSvc.push(
              renderSimpleInformation("You have not entered any name.")
            );
            await infoDialog.interact();
            infoDialog.close();
            continue;
          }
          const progressDialog = this.windowsSvc.push(
            renderSimpleProgres("Working...")
          );
          try {
            await this.api.patchChatroomInfo(
              renameChatroomDialogResult.chatroomTopic
            );
            await this.transportSvc.loadPolledDataRecentMessagesOnly();
          } finally {
            progressDialog.close();
          }
          return;
        } catch (e) {
          console.error(e);
          const errDlg = this.windowsSvc.push(renderErrorDialog(e));
          await errDlg.interact();
          errDlg.close();
        }
      }
    } finally {
      renameChatroomDialog.close();
    }
  }
}
