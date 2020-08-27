import { WindowsSvc } from "../components/Windows/WindowsSvc";
import { ChatHTTPApi } from "../services/ChatHTTPApi";
import {
  renderSimpleQuestion,
  renderSimpleInformation,
} from "../components/Windows/Windows";
import { renderErrorDialog } from "../components/Dialogs/ErrorDialog";
import { Messages } from "../model/Messages";
import { TransportSvc } from "../services/TransportSvc";

export class AbandonChatroomWorkflow {
  constructor(
    public windowsSvc: WindowsSvc,
    public transportSvc: TransportSvc,
    public terminateChatroom: () => void,
    public api: ChatHTTPApi,
  ) {}

  async start() {
    const questionDialog = this.windowsSvc.push(
      renderSimpleQuestion(
        `Are you sure to abandon the chatroom? 
        You are not able to go back unless invited again.`
      )
    );
    try {
      const answer = await questionDialog.interact();
      if (answer.isCancel) return;
      await this.api.abandonChatroom();
      questionDialog.close();
      this.transportSvc.terminateLoop();
      this.terminateChatroom();
      this.windowsSvc.push(
        renderSimpleInformation("You have abandoned the chatroom.")
      );
    } catch (e) {
      console.error(e);
      const errDlg = this.windowsSvc.push(renderErrorDialog(e));
      await errDlg.interact();
      errDlg.close();
    } finally {
      questionDialog.close();
    }
  }
}
