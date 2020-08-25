/*export function* inviteUsers() {
  const dlgUsersToInvite = dialogChooseUsersToInvite();
  const dlgUsersToInviteInteraction = yield* dlgUsersToInvite.interact();
  dlgUsersToInvite.close();
  if (dlgUsersToInviteInteraction.isClose) return;
  const dlgInvitingUsers = dialogInvitingUsersProgress();
  yield* apiInviteUsers(userList);
  dlgInvitingUsers.close();
}

export function* abandonChatroom() {
  const dlgAbandonChatroom = dialogAbandonChatroom();
  const dlgAbandonChatroomInteraction = yield* dlgAbandonChatroom.interact();
  dlgAbandonChatroom.close();
  if(dlgAbandonChatroomInteraction.isCancel) return
  yield* apiAbandonChatroom();
  chatroomAbandoned();
}
*/

export default 0;