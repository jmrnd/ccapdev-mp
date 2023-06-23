
function editPost(){
    //getting title text
    var postTitle = document.getElementById('postTitle');
    var titleText = postTitle.innerHTML;
    //getting post text paragraph
    var postPara = document.getElementById('postText');
    var paraText = postPara.innerHTML;
    //removing elements
    postTitle.remove();
    postPara.remove();

    var titleInput = document.createElement("INPUT");//creating element input

    //setting up attribute of input, class name, and id
    titleInput.setAttribute("value", titleText);
    titleInput.className = "create-a-post-title rounded";
    titleInput.id = "postTitleEdit";

    var postTextInput = document.createElement("TEXTAREA"); //creating element textarea
    
    //creating text node to put in the text area
    var postTextInputTextNode = document.createTextNode(paraText);
    postTextInput.appendChild(postTextInputTextNode);

    //setting up textarea id and class
    postTextInput.className="create-a-post-box card col-md-12 mt-2 mb-0";
    postTextInput.id="postTextEdit";

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

function saveChanges(){
    /*start - getting getting the new title and replacing the original*/
    //getting the inputted title in the input bar
    var getTitle = document.getElementById("postTitleEdit");
    var newTitle = getTitle.value;

    var titlePara = document.createElement("P");//creating paragraph element

    //assigning attributes, class name, and id.
    /* it should be the same as the original so that it can be edited again*/
    titlePara.innerHTML = newTitle;
    titlePara.className = "post-title";
    titlePara.id = "postTitle";

    getTitle.remove();//removing the input bar
    document.getElementById("title").appendChild(titlePara);//putting the new title in the html
    /*end - getting getting the new title and replacing it form the original*/


    /*start - getting the new post text and replacing the original*/
    //retrieving the new inputted text in the textarea
    var getText = document.getElementById("postTextEdit");
    var newText = getText.value; 

    var postPara = document.createElement("P");//creating paragraph element for the post text
    //assigning attributes, class name, and id for the post text it
    /* it should be the same as the original so that it can be edited again*/
    postPara.innerHTML = newText
    postPara.className = "post-text";
    postPara.id = "postText"

    getText.remove(); //removing the textarea
    document.getElementById("post").appendChild(postPara); //putting the new paragraph in the html
     /*end - getting the new post text and replacing the original*/

     //removing the save button
    document.getElementById("saveButton").remove();
     
}

//for testing buttons or links 
function itWorks(){
    alert("it works");
}

