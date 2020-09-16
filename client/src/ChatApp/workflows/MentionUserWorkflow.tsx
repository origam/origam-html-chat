import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import {
  renderMentionUserDialog,
  UserToMention,
} from "../components/Dialogs/MentionUserDialog";

export class MentionUserWorkflow {
  constructor(public windowsSvc: WindowsSvc, public api: ChatHTTPApi) {}

  async start(feedUsersToMention: (users: UserToMention[]) => void) {
    const mentionDialog = this.windowsSvc.push(renderMentionUserDialog());
    try {
      const mentionDialogResult = await mentionDialog.interact();
      if (mentionDialogResult.choosenUsers) {
        feedUsersToMention(mentionDialogResult.choosenUsers);
      }
    } finally {
      mentionDialog.close();
    }
  }
}
