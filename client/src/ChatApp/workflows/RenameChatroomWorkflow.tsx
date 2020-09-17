import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";
import { renderInviteUserDialog } from "../components/Dialogs/InviteUserDialog";
import { renderRenameChatroomDialog } from "../components/Dialogs/RenameChatroomDialog";
import {
  renderSimpleInformation,
  renderSimpleProgres,
  renderSimpleQuestion,
} from "../components/Windows/Windows";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";

export class InviteUserWorkflow {
  constructor(public windowsSvc: WindowsSvc, public api: ChatHTTPApi) {}

  async start() {
    const renameChatroomDialog = this.windowsSvc.push(renderRenameChatroomDialog());
    try {
      while (true) {
        try {
          const inviteUserDialogResult = await renameChatroomDialog.interact();
          if(!inviteUserDialogResult.chatroomTopic) {
            const infoDialog = this.windowsSvc.push(
              renderSimpleInformation("You have not entered any name.")
            );
            await infoDialog.interact();
            infoDialog.close();
            continue
          }

                  const progressDialog = this.windowsSvc.push(
                    renderSimpleProgres("Working...")
                  );
                  try {
                    await this.api.
                  } finally {
                    progressDialog.close();
                  }
                  return;
                } else if (confirmationResult.isCancel) {
                }
              } finally {
                confirmationDialog.close();
              }
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
