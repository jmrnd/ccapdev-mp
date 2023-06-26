function editPost() {
  //getting title text
  var postTitle = document.getElementById("postTitle");
  var titleText = postTitle.innerHTML;
  //getting post text paragraph
  var postPara = document.getElementById("postText");
  var paraText = postPara.innerHTML;
  //removing elements
  postTitle.remove();
  postPara.remove();

  var titleInput = document.createElement("INPUT"); //creating element input

  //setting up attribute of input, class name, and id
  titleInput.setAttribute("value", titleText);
  titleInput.className = "create-a-post-title rounded";
  titleInput.id = "postTitleEdit";

  var postTextInput = document.createElement("TEXTAREA"); //creating element textarea

  //creating text node to put in the text area
  var postTextInputTextNode = document.createTextNode(paraText);
  postTextInput.appendChild(postTextInputTextNode);

  //setting up textarea id and class
  postTextInput.className = "create-a-post-box card col-md-12 mt-2 mb-0";
  postTextInput.id = "postTextEdit";

  //appending the created elements in the html
  document.getElementById("post").appendChild(postTextInput);
  document.getElementById("title").appendChild(titleInput);

  //creating button
  var saveButton = document.createElement("BUTTON");
  var saveButtonText = document.createTextNode("save");

  //assigning the button attribute, values, and function.
  saveButton.onclick = saveChanges;
  saveButton.appendChild(saveButtonText);
  saveButton.className = "create-post-button rounded";
  saveButton.id = "saveButton";

  //adding the button in the html
  document.getElementById("post").appendChild(saveButton);
}

function saveChanges() {
  /*start - getting getting the new title and replacing the original*/
  //getting the inputted title in the input bar
  var getTitle = document.getElementById("postTitleEdit");
  var newTitle = getTitle.value;

  var titlePara = document.createElement("P"); //creating paragraph element

  //assigning attributes, class name, and id.
  /* it should be the same as the original so that it can be edited again*/
  titlePara.innerHTML = newTitle;
  titlePara.className = "post-title";
  titlePara.id = "postTitle";

  getTitle.remove(); //removing the input bar
  document.getElementById("title").appendChild(titlePara); //putting the new title in the html
  /*end - getting getting the new title and replacing it form the original*/

  /*start - getting the new post text and replacing the original*/
  //retrieving the new inputted text in the textarea
  var getText = document.getElementById("postTextEdit");
  var newText = getText.value;

  var postPara = document.createElement("P"); //creating paragraph element for the post text
  //assigning attributes, class name, and id for the post text it
  /* it should be the same as the original so that it can be edited again*/
  postPara.innerHTML = newText;
  postPara.className = "post-text";
  postPara.id = "postText";

  getText.remove(); //removing the textarea
  document.getElementById("post").appendChild(postPara); //putting the new paragraph in the html
  /*end - getting the new post text and replacing the original*/

  //removing the save button
  document.getElementById("saveButton").remove();
}

function reply() {
  //getting the needed attributes
}

function createCommentBox() {
  //text part and getting user and image
  var replyText = document.getElementById("CommentBox");
  var commentUser = document.getElementById("userId");
  var userProfilesrc = document.getElementById("UserProfilePic").src;

  //generate id for div
  var divUniqID = "div_" + Date.now();
  var divUniqID_Comment = "divComment_" + Date.now();
  var divUniqID_divComment = "divDivComment_" + Date.now();

  //creating an img element and assigning attributes
  var userProfile = document.createElement("IMG");
  userProfile.src = userProfilesrc;
  userProfile.width = "35";
  userProfile.height = "35";

  //creating "A" for user link
  var userALink = document.createElement("A");
  userALink.href = "#";
  userALink.className = "comment-user link-underline link-underline-opacity-0";
  userALink.innerHTML = commentUser.innerHTML;

  //creating 'span' element for the format of the userlink
  var userSpan = document.createElement("SPAN");
  userSpan.className = "post-author ms-2 pt-2";
  userSpan.appendChild(userALink);

  //creating p element for the body of the comment
  var replyTextinP = document.createElement("P");
  replyTextinP.id = divUniqID_Comment;
  replyTextinP.className = "comment-text";
  replyTextinP.innerHTML = replyText.value;

  //creating var for buttons and their images
  //edit button
  var editButtonImg = document.createElement("IMG");
  editButtonImg.src = "../images/pencil-solid.svg";
  editButtonImg.className = "comment-icos";
  editButtonImg.width = "20";
  editButtonImg.height = "20";
  //delete button
  var deleteButtonImg = document.createElement("IMG");
  deleteButtonImg.src = "../images/trash-can-solid.svg";
  deleteButtonImg.className = "comment-icos";
  deleteButtonImg.width = "20";
  deleteButtonImg.height = "20";

  //function for edit button
  var editButtonImgA = document.createElement("A");
  editButtonImgA.href = "#";
  editButtonImgA.onclick = function commenttextarea() {
    var getText = document.getElementById(divUniqID_Comment);
    var getTextInside = getText.innerHTML;
    getText.remove();

    var createTextArea = document.createElement("TEXTAREA");
    var getTextInsideTextNode = document.createTextNode(getTextInside);
    createTextArea.id = "createTextAreaID";
    createTextArea.appendChild(getTextInsideTextNode);
    createTextArea.className = "edit-post-of-comment rounded";
    document.getElementById(divUniqID_divComment).appendChild(createTextArea);

    //save button
    var createSaveButton = document.createElement("BUTTON");
    var createSaveButtonText = document.createTextNode("save");

    createSaveButton.appendChild(createSaveButtonText);
    createSaveButton.className = "create-post-button rounded";
    createSaveButton.id = "saveButtonCommentSection";
    createSaveButton.onclick = function () {
      var getEditedCommentText = document.getElementById("createTextAreaID");
      var getEditedCommentTextValue = getEditedCommentText.value;

      var newSavedTextP = document.createElement("P");
      newSavedTextP.innerHTML = getEditedCommentTextValue;
      newSavedTextP.className = "comment-text";
      newSavedTextP.id = divUniqID_Comment;
      getEditedCommentText.remove();

      document.getElementById(divUniqID_divComment).appendChild(newSavedTextP);
      document.getElementById("saveButtonCommentSection").remove();
    };
    document.getElementById(divUniqID_divComment).appendChild(createSaveButton);
  };
  editButtonImgA.appendChild(editButtonImg);

  //creating functions for the delete button
  var deleteButtonImgA = document.createElement("A");
  deleteButtonImgA.href = "#";
  deleteButtonImgA.onclick = function () {
    var divToDelete = document.getElementById(divUniqID);
    divToDelete.parentNode.removeChild(divToDelete);
  };
  deleteButtonImgA.appendChild(deleteButtonImg);

  /*start footer*/
  //img for upvote and downvote
  var upImg = document.createElement("IMG");
  var downImg = document.createElement("IMG");
  upImg.src = "../images/upvote.svg";
  downImg.src = "../images/downvote.svg";
  upImg.className = "me-2";
  upImg.width = "20";
  upImg.height = "20";
  downImg.className = "me-2";
  downImg.width = "20";
  downImg.height = "20";

  //creating element for 'a' element
  var aUp = document.createElement("A");
  var aDown = document.createElement("A");
  aUp.href = "#";
  aDown.href = "#";
  aUp.className = "d-sm-flex align-items-sm-center";
  aDown.className = "d-sm-flex align-items-sm-center";

  aUp.appendChild(upImg);
  aDown.appendChild(downImg);
  //counter for the votes
  var spanFooterVote = document.createElement("SPAN");
  spanFooterVote.className = "post-num-votes";
  spanFooterVote.innerHTML = "0";
  //comment/replies
  var commentImg = document.createElement("IMG");

  commentImg.className = "ms-4 me-2";
  commentImg.src = "../images/comment.svg";
  commentImg.width = "20";
  commentImg.height = "20";

  var spanFooterComment = document.createElement("SPAN");
  spanFooterComment.className = "post-num-comments me-1";
  spanFooterComment.innerHTML = "0 replies";

  var aReplies = document.createElement("A");
  aReplies.href = "#";
  aReplies.className =
    "d-sm-flex align-items-sm-center link-offset-2 link-underline link-underline-opacity-0";
  aReplies.appendChild(commentImg);
  aReplies.appendChild(spanFooterComment);

  //div for the footer
  var divFooter = document.createElement("DIV");
  divFooter.className = "comment-footer d-inline-flex flex-row";
  divFooter.appendChild(aUp);
  divFooter.appendChild(spanFooterVote);
  divFooter.appendChild(aDown);
  divFooter.appendChild(aReplies);
  /*end footer*/

  //create div for the comment text section of the comment box
  var divCommentTextSection = document.createElement("DIV");
  divCommentTextSection.id = divUniqID_divComment;
  divCommentTextSection.appendChild(replyTextinP);

  ///* Start of the div format for the card box*///
  //div for comment-content (format)
  var divCommentContent = document.createElement("DIV");
  divCommentContent.className = "comment-content";
  divCommentContent.appendChild(divCommentTextSection);
  divCommentContent.appendChild(divFooter);

  //div for comment-thread(format)
  var divCommentThread = document.createElement("DIV");
  divCommentThread.className = "comment-thread";
  divCommentThread.appendChild(divCommentContent);

  //div for card-body rounded(format)
  var divCardBody = document.createElement("DIV");
  divCardBody.className = "card-body rounded";
  divCardBody.appendChild(userProfile);
  //
  divCardBody.appendChild(deleteButtonImgA);
  divCardBody.appendChild(editButtonImgA);
  //
  divCardBody.appendChild(userSpan);
  divCardBody.appendChild(divCommentThread);

  //div for card mt-2 mb-0 (format)
  var divCard = document.createElement("DIV");
  divCard.className = "card mt-2 mb-0";
  divCard.appendChild(divCardBody);

  //div for col-md-7(format)
  var divColMd = document.createElement("DIV");
  divColMd.className = "col-md-7";
  divColMd.appendChild(divCard);

  //div for row d-flex justify-content-center (format)
  var divRow = document.createElement("DIV");
  divRow.className = "row d-flex justify-content-center";
  divRow.id = divUniqID;
  divRow.appendChild(divColMd);
  ///* End of the div format for the card box*///

  replyText.value = "";
  document.getElementById("commentSpace").appendChild(divRow); //adding to the html
}

//for testing buttons or links
function itWorks() {
  var userProfile = document.getElementById("UserProfilePic");
  document.body.appendChild(userProfile);
  //alert("it works");
}
