document.addEventListener("DOMContentLoaded", ( event ) => {
    // EDIT COMMENT
    // Get all the edit comment buttons
    const editCommentBtns = document.querySelectorAll(".edit-comment-btn");
    const deleteCommentBtns = document.querySelectorAll(".delete-comment-btn");

    // Add click event listener to each edit comment button
    editCommentBtns.forEach(event => {event.addEventListener("click", function (e) {
        e.preventDefault();

        const get_id = e.target.id;
        const paramId = get_id.split("/"); // In array

        const commentText = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".comment-text")

        // Create the textarea element for editing
        const commentInput = document.createElement("textarea");
        commentInput.classList.add("edit-text-area", "form-control", "mb-3");
        commentInput.value = commentText.textContent.trim();
        commentText.replaceWith(commentInput);
    
        const currentComment = commentText.innerText;
        commentText.replaceWith(commentInput);

        commentInput.style.display = "block";
        commentInput.focus();

        const iconGridBox = document.getElementById(`iconGrid${paramId[3]}`); // Get the iconGrid element
        const editCommentButton = document.createElement("button");
        const cancelEditCommentButton = document.createElement("button");

        editCommentButton.classList.add("comment-button", "rounded", "float-end");
        editCommentButton.textContent = "Edit"; // Set the button text
        cancelEditCommentButton.classList.add("cancel-edit-button", "rounded", "float-end", "mx-2");
        cancelEditCommentButton.textContent = "Cancel";
        
        cancelEditCommentButton.addEventListener("click", function() {
            if (commentInput.parentElement) {
                commentInput.parentElement.replaceChild(commentText, commentInput);
            }

            editCommentButton.remove();
            cancelEditCommentButton.remove();

            commentText.textContent = currentComment;
        });

        editCommentButton.addEventListener("click", async function() {

            const updatedCommentText = commentInput.value;
            commentText.textContent = updatedCommentText;
        
            commentInput.replaceWith(commentText);
        
            try {
                const data = {
                    commentId: paramId[3],
                    postId: paramId[2],
                    updateComment: updatedCommentText, // Use the updated text here
                }
        
                const response = await fetch(get_id, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data), // parse ID
                });
        
                if(response.status == 200) { // Server successfully updates comment
                    location.reload();
                }
        
            } catch (err) {
                console.log(err);
            }
        });
        
        iconGridBox.appendChild(editCommentButton);
        iconGridBox.appendChild(cancelEditCommentButton);
    })});

    // DELETE COMMENT
    deleteCommentBtns.forEach(btn => {
    btn.addEventListener("click", async function (e) {
        const confirmed = window.confirm('Are you sure you want to delete this comment?');

        if (confirmed) {
        const get_path = e.target.id;
        console.log(get_path);

        try {
            const dataArray = get_path.split('/');
            const data = {
            postId: dataArray[2],
            commentId: dataArray[3],
            };

            const response = await fetch(get_path, {
                method: 'DELETE',
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (response.status == 200) {
                const commentElement = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                commentElement.remove();
                location.reload();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
        } else {
            console.log('Deletion canceled!');
        }
    });
    });
})

// SORT COMMENTS
let activeSortComment = -1; // Default (0 - Date, 1 - Votes)

const toggleSortComment = (sortOption) => {
if (activeSortComment !== sortOption) {
    const sortDateBtnComment = document.getElementById("sortDateComment");
    const sortUpvotesBtnComment = document.getElementById("sortUpvotesComment");

    sortDateBtnComment.classList.toggle("active", sortOption === 0);
    sortUpvotesBtnComment.classList.toggle("active", sortOption === 1);

    activeSortComment = sortOption;

    const commentsContainer = document.getElementById("commentsContainer");
    const comments = Array.from(commentsContainer.getElementsByClassName("comment-card"));

    comments.sort((commentA, commentB) => {
    const dateA = new Date(commentA.getAttribute("data-date-comments"));
    const dateB = new Date(commentB.getAttribute("data-date-comments"));
    const upvotesA = Number(commentA.getAttribute("data-upvotes-comments"));
    const upvotesB = Number(commentB.getAttribute("data-upvotes-comments"));

    if (activeSortComment === 0) {
        // Sort by Date
        return dateB - dateA;
    } else {
        // Sort by Upvotes
        return upvotesB - upvotesA;
    }
    });

    commentsContainer.innerHTML = ""; // Clear container
    comments.forEach((comment) => {
    commentsContainer.appendChild(comment);
    });
}
};

const sortDateBtnComment = document.getElementById("sortDateComment");
const sortUpvotesBtnComment = document.getElementById("sortUpvotesComment");

sortDateBtnComment.classList.toggle("active", activeSortComment === 0);
sortUpvotesBtnComment.classList.toggle("active", activeSortComment === 1);

sortDateBtnComment.addEventListener("click", () => toggleSortComment(0));
sortUpvotesBtnComment.addEventListener("click", () => toggleSortComment(1));
