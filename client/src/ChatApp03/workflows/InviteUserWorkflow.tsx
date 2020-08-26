import { WindowsSvc, IModalHandle } from "../components/Windows/WindowsSvc";
import { renderInviteUserDialog } from "../components/Dialogs/InviteUserDialog";
import {
  SimpleQuestion,
  renderSimpleQuestion,
} from "../components/Windows/Windows";

export class InviteUserWorkflow {
  constructor(public windowsSvc: WindowsSvc) {}

  async start() {
    const inviteUserDialog = this.windowsSvc.push(renderInviteUserDialog());
    try {
      while (true) {
        const inviteUserDialogResult = await inviteUserDialog.interact();

        if (inviteUserDialogResult.userClicked) {
          const confirmationDialog = this.windowsSvc.push(
            renderSimpleQuestion("This will add the user to the conversation.")
          );
          try {
            const confirmationResult = await confirmationDialog.interact();
            if (confirmationResult.isOk) {
              // TODO: call api to invite the user.
              return;
            } else if (confirmationResult.isCancel) {
            }
          } finally {
            confirmationDialog.close();
          }
        } else if (inviteUserDialogResult.isCancel) return;
      }
    } finally {
      inviteUserDialog.close();
    }
  }
}
