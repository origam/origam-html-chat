import { renderCreateChatroomDialog } from "../components/Dialogs/CreateChatroomDialog";
import { renderInviteUserDialog } from "../components/Dialogs/InviteUserDialog";
import {
  renderSimpleInformation,
  renderSimpleProgres, renderSimpleQuestion
} from "../components/Windows/Windows";
import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";

export class CreateChatroomWorkflow {
  constructor(public windowsSvc: WindowsSvc, public api: ChatHTTPApi) {}

  async start() {
    const inviteUserDialog = this.windowsSvc.push(renderCreateChatroomDialog());
    try {
      while (true) {
        const inviteUserDialogResult = await inviteUserDialog.interact();
        if (inviteUserDialogResult.choosenUsers) {
          if (inviteUserDialogResult.choosenUsers.length === 0) {
            const infoDialog = this.windowsSvc.push(
              renderSimpleInformation("You have not selected any user.")
            );
            await infoDialog.interact();
            infoDialog.close();
          } else {
            const confirmationDialog = this.windowsSvc.push(
              renderSimpleQuestion(
                `Are you sure to add selected users to the conversation? 
                Selected users count: ${inviteUserDialogResult.choosenUsers.length}`
              )
            );
            try {
              const confirmationResult = await confirmationDialog.interact();
              if (confirmationResult.isOk) {
                // TODO: call api to invite the user.
                const progressDialog = this.windowsSvc.push(
                  renderSimpleProgres("Working...")
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
                const infoDialog = this.windowsSvc.push(
                  renderSimpleInformation(
                    `Invited users: ${inviteUserDialogResult.choosenUsers.length}`
                  )
                );
                await infoDialog.interact();
                infoDialog.close();
                return;
              } else if (confirmationResult.isCancel) {
              }
            } finally {
              confirmationDialog.close();
            }
          }
        } else if (inviteUserDialogResult.isCancel) return;
      }
    } finally {
      inviteUserDialog.close();
    }
  }
}
