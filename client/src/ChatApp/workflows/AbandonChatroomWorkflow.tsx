import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import {
  renderSimpleQuestion,
  renderSimpleInformation,
  renderSimpleProgress,
} from "../components/Windows/Windows";
import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";
import { Messages } from "../model/Messages";
import { TransportSvc } from "../services/TransportSvc";
import { renderOutviteUserDialog } from "../components/Dialogs/OutviteUserDialog";
import { LocalUser } from "../model/LocalUser";

export class AbandonChatroomWorkflow {
  constructor(
    public windowsSvc: WindowsSvc,
    public transportSvc: TransportSvc,
    public terminateChatroom: () => void,
    public api: ChatHTTPApi,
    public localUser: LocalUser
  ) {}

  async start() {
    const inviteUserDialog = this.windowsSvc.push(renderOutviteUserDialog());
    try {
      while (true) {
        try {
          const outviteUserDialogResult = await inviteUserDialog.interact();
          if (outviteUserDialogResult.choosenUsers) {
            if (outviteUserDialogResult.choosenUsers.length === 0) {
              const infoDialog = this.windowsSvc.push(
                renderSimpleInformation("You have not selected any user.")
              );
              await infoDialog.interact();
              infoDialog.close();
            } else {
              const confirmationDialog = this.windowsSvc.push(
                renderSimpleQuestion(
                  `Are you sure to kick selected users out of the conversation? 
                Selected users count: ${outviteUserDialogResult.choosenUsers.length}`
                )
              );
              try {
                const confirmationResult = await confirmationDialog.interact();
                if (confirmationResult.isOk) {
                  // TODO: call api to invite the user.
                  const progressDialog = this.windowsSvc.push(
                    renderSimpleProgress("Working...")
                  );
                  const userIds = outviteUserDialogResult.choosenUsers.map(
                    (user) => ({
                      userId: user.id,
                    })
                  );
                  try {
                    await this.api.outviteUsers({
                      users: userIds,
                    });
                  } finally {
                    progressDialog.close();
                  }
                  if (userIds.findIndex((user) => user.userId === this.localUser.id) > -1) {
                    // Kicked off users contained local user. Terminate the app...
                    this.transportSvc.terminateLoop();
                    this.terminateChatroom();
                    this.windowsSvc.push(
                      renderSimpleInformation(
                        "You have abandoned the chatroom.",
                        true,
                        true
                      )
                    );
                  }
                  return;
                } else if (confirmationResult.isCancel) {
                }
              } finally {
                confirmationDialog.close();
              }
            }
          } else if (outviteUserDialogResult.isCancel) return;
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
