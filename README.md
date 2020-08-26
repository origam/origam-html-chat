# Origam chat HTTP protocol description


`GET chatrooms/:chatroomId/messages`

Description:
> The method queries given chatroom for the messages. Messages are returned in ascending order, ordered by the time when they were sent.

URL parameters:
 
 - `chatroomId` - GUID chatroom id from which to return the messages.

Query parameters:
 
 - `limit` - *(optional)* number limiting number of messages returned.
 - `afterIdIncluding` - *(optional)* GUID filtering returned messages to contain only those as old as or older than the one with given id.
 - `beforeIdIncluding` - *(optional)* GUID filtering returned messages to contain only those as old as or newer than the one with given id.

Return value: JSON array:

[
   
   - `id` - GUID message identifier.
   - `authorId` - GUID identifier of message sender.
   - `authorName` - string human readable text to display as a message sender's name.
   - `authorAvatarUrl` - string url of a picture used as a user's avatar in the chat log.
   - `timeSent` - string ISO time when the message was received by the server.
   - `text` - string textual content of the message.
   - `mentions`- array of users mentioned in the message [
      
      - `id` - GUID user identifier.
      - `name` - string user name.
      - `avatarUrl` - string url of an image to display as the participant's avatar.

   - ] 

]

***



`POST chatrooms/:chatroomId/messages`

Description:
> Posts the message into given chatroom.

URL parameters:

 - `chatroomId` - GUID chatroom id to which the message should be inserted.

Request body: JSON object:


  
  - `id` - GUID identifier of the message
  - `text` - Textual context of the message 
  - `mentions`- array of users to mention in the message [

    - `id` - GUID user identifier.

  - ] 



 ***



 `GET chatrooms/:chatroomId/info`

Description:
> Obtains information about the chatroom.

URL parameters:

 - `chatroomId` - GUID chatroom id to get the information about.

Return value: JSON object:

 - `topic` - string human readable text to display as the chatroom's name / title

***



 `PATCH chatrooms/:chatroomId/info`

Description:
> Changes information about the chatroom.

URL parameters:

 - `chatroomId` - GUID chatroom id to update the information about.

Request body: JSON object:

 - `topic` - string human readable text to display as the chatroom's name / title

***



`GET chatrooms/:chatroomId/participants`

Description:
> Get list of people involved in the chatroom.

URL parameters:

 - `chatroomId` - GUID chatroom id to which the message should be inserted.

Return value: flat JSON array:

[

   - `id` - GUID user identifier.
   - `name` - string user name.
   - `avatarUrl` - string url of an image to display as the participant's avatar.
   - `status` - string status specifier. One of `online`, `away`, `offline`, `none` .

]

***



`POST chatrooms/:chatroomId/inviteUser`

Description:
> Invite given user to the chatroom

URL parameters:

 - `chatroomId` - GUID chatroom id to which the user should be invited.

Request body: JSON object:

 - `userId` - GUID identifier of user to be invited.

***



`GET chatrooms/:chatroomId/usersToInvite`

Description:
> Lists users which can be invited to the given channel, filtering them by given phrase, limiting the returned item count. 

URL parameters:

 - `chatroomId` - GUID chatroom id where the users are searched to invite to.

Query parameters:

 - `limit` - *(optional)* number limiting number of users returned.
 - `offset` - *(optional)* number offset where list should begin.
 - `searchPhrase` - *(optional)* - string used to fultext constrain the query to just users of interrest.

Return value: flat JSON array:

[

   - `id` - GUID user identifier.
   - `name` - string user name.
   - `avatarUrl` - string url of an image to display as the participant's avatar.

]

***



`POST chatrooms/:chatroomId/abandon`

Description:
> Abandon given chatroom, clearing the user's invitation. User is no longer able to enter the chatroom unless invited again.

URL parameters:

 - `chatroomId` - GUID chatroom id which the user wants to abandon.

***



`GET chatrooms/:chatroomId/usersToMention`

Description:
> Lists users which can be mentioned in the chatroom given. 

URL parameters:

 - `chatroomId` - GUID chatroom id where the users are searched to be mentioned in.

Query parameters:

 - `limit` - *(optional)* number limiting number of users returned.
 - `offset` - *(optional)* number offset where list should begin.
 - `searchPhrase` - *(optional)* - string used to fultext constrain the query to just users of interrest.

Return value: flat JSON array:

[

   - `id` - GUID user identifier.
   - `name` - string user name.
   - `avatarUrl` - string url of an image to display as the participant's avatar.

]

***



`GET localUser`

Description:
> Obtain information about the user chatting in this session. The user's requests are correlated by a session id cookie or an authentication token.

Return value: JSON object:

 - `id` - GUID identifier of the user.
 - `name` - string human readable name of the user.
 - `avatarUrl` - string url of an image to be used as the user's avatar.

***



`GET chatrooms/:chatroomId/polledData`

Description:
> The method is used to poll for various chatroom data. It returns merged data from following endpoints:

 - `GET chatrooms/:chatroomId/messages`
 - `GET chatrooms/:chatroomId/info`
 - `GET chatrooms/:chatroomId/participants`
 - `GET localUser`

The method's query and url parameters have the same meaning as for the original endpoints, see the endpoints' descriptions.

Return value: JSON object:

 - `messages` - contains the response of corresponding endpoint
 - `info` - contains the response of corresponding endpoint
 - `participants` - contains the response of corresponding endpoint
 - `localUser` - contains the response of corresponding endpoint
