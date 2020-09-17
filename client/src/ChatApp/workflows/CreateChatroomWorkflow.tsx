import { renderCreateChatroomDialog } from "../components/Dialogs/CreateChatroomDialog";
import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";
import { renderInviteUserDialog } from "../components/Dialogs/InviteUserDialog";
import {
  renderSimpleInformation,
  renderSimpleProgres,
  renderSimpleQuestion,
} from "../components/Windows/Windows";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";

export class CreateChatroomWorkflow {
  constructor(public windowsSvc: WindowsSvc, public api: ChatHTTPApi) {}

  async start(references: { [key: string]: any } | undefined) {
    const createChatroomDialog = this.windowsSvc.push(
      renderCreateChatroomDialog(references)
    );
    try {
      while (true) {
        try {
          const inviteUserDialogResult = await createChatroomDialog.interact();
          if (!inviteUserDialogResult.chatroomTopic) {
            const infoDialog = this.windowsSvc.push(
              renderSimpleInformation("You have not entered any topic.")
            );
            await infoDialog.interact();
            infoDialog.close();
            continue;
          }
          if (inviteUserDialogResult.choosenUsers) {
            const progressDialog = this.windowsSvc.push(
              renderSimpleProgres("Creating chatroom...")
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
        } catch (e) {
          console.error(e);
          const errDlg = this.windowsSvc.push(renderErrorDialog(e));
          await errDlg.interact();
          errDlg.close();
        }
      }
    } finally {
      createChatroomDialog.close();
    }
  }
}
