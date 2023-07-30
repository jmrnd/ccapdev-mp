// EDIT COMMENT
const editCommentBtns = document.querySelectorAll(".edit-comment-btn");
const deleteCommentBtns = document.querySelectorAll(".delete-comment-btn");

// Add click event listener to each edit comment button
editCommentBtns.forEach(event => {
event.addEventListener("click", function (e) {
    e.preventDefault();

    // we get the body where the text and try to replace it with an input
    const commentText = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".comment-text")
    const commentInput = document.createElement("textarea"); // create input element
    commentInput.classList.add("edit-text-area");
    commentInput.setAttribute("rows", "5"); // Set the number of rows (you can change this value)
    commentInput.setAttribute("cols", "20"); // Set the number of columns (you can change this value)
    commentInput.value = commentText.textContent.trim();

    // Replace the comment text with the input field
    commentText.replaceWith(commentInput);

    // Show the input field and focus on it
    commentInput.style.display = "block";
    commentInput.focus();

    const get_id = e.target.id;

    // Add event listener to save changes on Enter key press or blur
    commentInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        // Save changes and update the comment text
        commentText.textContent = this.value;
        // Replace the input field with the updated comment text
        this.replaceWith(commentText);

        try {
            const paramId = get_id.split("/"); // In array

            const data = {
                postId: paramId[1],
                commentId: paramId[2],
                updateComment: commentText.textContent,
            }

            const res = fetch(get_id, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // parse ID
            })
        } catch (err) {
            console.log(err);
        }


        const notifyEdited = document.createElement("p");
        notifyEdited.textContent = "Edited";
        notifyEdited.classList.add("edited-notify");
        commentText.insertAdjacentElement("afterend",notifyEdited);
    }
    });
});
});

/*** DELETE COMMENT ***/
 deleteCommentBtns.forEach(event => {
    event.addEventListener("click", async function (e) {

      const confirmed = window.confirm('Are you sure you want to delete this comment?');
      console.log(confirmed);

      // If user confirms (OK button clicked), proceed with deletion
      if (confirmed) {

          get_path = e.target.id;
          console.log(get_path);
          // fetch req
          try {
            const response = await fetch(get_path);
            const data = await response.json();
            // Handle the response data here
            const commentElement = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            
            commentElement.remove();
            console.log(data);
          } catch (error) {
            // Handle errors here
            console.error('Error deleting comment:', error);
          }
        } else {
          // If user cancels (Cancel button clicked), do nothing or provide feedback
          console.log('Deletion canceled!');
        }
  })
});

// REPLY
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("Script is running");
    const replyButtons = document.querySelectorAll(".reply-button");
    const replyForms = document.querySelectorAll(".reply-form");

    replyButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            // Prevent the default action
            e.preventDefault();

            // Get the associated form using the data-id value
            const replyForm = document.getElementById(
                "reply-form-" + button.dataset.id
            );

            // Toggle the display of the reply form
            replyForm.style.display =
                replyForm.style.display === "none" ? "block" : "none";
        });
    });

    replyForms.forEach((form) => {
        form.addEventListener("submit", async function (e) {
            // Prevent the default form submission
            e.preventDefault();

            // Get the associated comment id
            const commentId = form.dataset.id;

            // Get the reply text from the form
            const replyText = form.querySelector("textarea").value;

            // Send the reply to the server
            const response = await fetch(`/create_reply/${commentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reply: replyText }),
            });

            if (response.ok) {
                // Clear the textarea
                form.querySelector("textarea").value = "";

                // Optionally, you could fetch and display the updated list of replies here
                // Refresh the page to see the new reply
                location.reload();
            } else {
                console.error("Failed to post reply", await response.text());
            }
        });
    });
});