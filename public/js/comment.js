// EDIT COMMENT
// Get all the edit comment buttons
const editCommentBtns = document.querySelectorAll(".edit-comment-btn");
const deleteCommentBtns = document.querySelectorAll(".delete-comment-btn");

  // Add click event listener to each edit comment button
editCommentBtns.forEach(event => {event.addEventListener("click", function (e) {
    e.preventDefault();

    // we get the body where the text and try to replace it with an input
    const commentText = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".comment-text")
    const commentInput = document.createElement("textarea"); // create input element
    commentInput.classList.add("edit-text-area");
    commentInput.setAttribute("rows", "5"); // Set the number of rows (you can change this value)
    commentInput.setAttribute("cols", "20"); // Set the number of columns (you can change this value)
    commentInput.value = commentText.textContent.trim();

    // Replace the comment text with the input field
    const currentComment = commentText.innerText;
    commentText.replaceWith(commentInput);

    // Show the input field and focus on it
    commentInput.style.display = "block";
    commentInput.focus();

    const get_id = e.target.id;
    console.log(get_id)
    // Add event listener to save changes on Enter key press or blur
    commentInput.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
        // Save changes and update the comment text
        commentText.textContent = this.value;
        // Replace the input field with the updated comment text
        this.replaceWith(commentText);

        try{
        const paramId = get_id.split("/"); // In array

        const data = {
            commentId: paramId[3],
            postId: paramId[2],
            updateComment: commentText.textContent,
        }

        const response = await fetch(get_id, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // parse ID
        });

        if(response.status == 200) { // Server successfully updates comment
            const responseData = await response.json();
            const editDate = moment(responseData.editDate).fromNow();
            commentDate.innerText = `• edited ${editDate}`;
        }

        } catch (err) {
            console.log(err);
        }
    }});
})});

// DELETE COMMENT
deleteCommentBtns.forEach(event => {event.addEventListener("click", async function (e) {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');

    // If user confirms (OK button clicked), proceed with deletion
    if (confirmed) {
        get_path = e.target.id;
        console.log(get_path);
        
        try {
            const dataArray = get_path.split('/');
            const data = {
                postId: dataArray[2],
                commentId: dataArray[3]
            }

            const response = await fetch(get_path, {
                method: 'DELETE',
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                }
            });
            
            if (response.status == 200) { // Server successfully finds comment and deletes it
                const commentElement = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                commentElement.remove();
                location.reload();
            }

        } catch (error) {
        // Handle errors here
        console.error('Error deleting comment:', error);
        }
    } else {
        // If user cancels (Cancel button clicked), do nothing or provide feedback
        console.log('Deletion canceled!');
    }
})});

// COMMENT BOX TEXTAREA
const textarea = document.querySelector("textarea");
    textarea.addEventListener("keyup", e => {
    textarea.style.height = "100px";
    textarea.style.minHeight = "100px";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight}px`;
});
