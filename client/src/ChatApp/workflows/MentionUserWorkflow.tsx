import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import {
  renderMentionUserDialog,
  UserToMention,
} from "../components/Dialogs/MentionUserDialog";
import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";

export class MentionUserWorkflow {
  constructor(public windowsSvc: WindowsSvc, public api: ChatHTTPApi) {}

  async start(feedUsersToMention: (users: UserToMention[]) => void) {
    const mentionDialog = this.windowsSvc.push(renderMentionUserDialog());
    try {
      while (true) {
        try {
          const mentionDialogResult = await mentionDialog.interact();
          if (mentionDialogResult.choosenUsers) {
            feedUsersToMention(mentionDialogResult.choosenUsers);
            return;
          }
          if (mentionDialogResult.isCancel) return;
        } catch (e) {
          console.error(e);
          const errDlg = this.windowsSvc.push(renderErrorDialog(e));
          await errDlg.interact();
          errDlg.close();
        }
      }
    } finally {
      mentionDialog.close();
    }
  }
}
