import { T, TR } from "util/translation";
import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";
import { renderInviteUserDialog } from "../components/Dialogs/InviteUserDialog";
import {
  renderSimpleInformation,
  renderSimpleProgress,
  renderSimpleQuestion,
} from "../components/Windows/Windows";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";

export class InviteUserWorkflow {
  constructor(public windowsSvc: WindowsSvc, public api: ChatHTTPApi) {}

  async start() {
    const inviteUserDialog = this.windowsSvc.push(renderInviteUserDialog());
    try {
      while (true) {
        try {
          const inviteUserDialogResult = await inviteUserDialog.interact();
          if (inviteUserDialogResult.choosenUsers) {
            if (inviteUserDialogResult.choosenUsers.length === 0) {
              const infoDialog = this.windowsSvc.push(
                renderSimpleInformation(
                  TR("You have not selected any user.", "no_user_selected")
                )
              );
              await infoDialog.interact();
              infoDialog.close();
            } else {
              // TODO: call api to invite the user.
              const progressDialog = this.windowsSvc.push(
                renderSimpleProgress(T("Working...", "working..."))
              );
              try {
                await this.api.inviteUsers({
                  users: inviteUserDialogResult.choosenUsers.map((user) => ({
                    userId: user.id,
                  })),
                });
              } finally {
                progressDialog.close();
              }
              return;
            }
          } else if (inviteUserDialogResult.isCancel) return;
        } catch (e) {
          console.error(e);
          const errDlg = this.windowsSvc.push(renderErrorDialog(e));
          await errDlg.interact();
          errDlg.close();
        }
      }
    } finally {
      inviteUserDialog.close();
    }
  }
}
