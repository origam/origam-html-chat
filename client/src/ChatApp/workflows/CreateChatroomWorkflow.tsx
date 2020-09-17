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
import qs from "querystring";

export class CreateChatroomWorkflow {
  constructor(
    public windowsSvc: WindowsSvc,
    public api: ChatHTTPApi,
    public history: any,
    public location: any
  ) {}

  async start(references: { [key: string]: any } | undefined) {
    const createChatroomDialog = this.windowsSvc.push(
      renderCreateChatroomDialog(references)
    );
    try {
      while (true) {
        try {
          const createChatroomDialogResult = await createChatroomDialog.interact();
          if (!createChatroomDialogResult.chatroomTopic) {
            const infoDialog = this.windowsSvc.push(
              renderSimpleInformation("You have not entered any topic.")
            );
            await infoDialog.interact();
            infoDialog.close();
            continue;
          }
          if (createChatroomDialogResult.choosenUsers) {
            const progressDialog = this.windowsSvc.push(
              renderSimpleProgres("Creating chatroom...")
            );
            try {
              debugger;
              const createChatroomResult = await this.api.createChatroom(
                references || {},
                createChatroomDialogResult.chatroomTopic,
                createChatroomDialogResult.choosenUsers.map((user) => user.id)
              );
              this.history.replace({
                pathname: this.location.pathname,
                search: `?${qs.stringify({
                  chatroomId: createChatroomResult.chatroomId,
                })}`,
              });
              return;
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
