
  // Get all the edit comment buttons
  const editCommentBtns = document.querySelectorAll(".edit-comment-btn");

  // Add click event listener to each edit comment button
  editCommentBtns.forEach((editCommentBtn) => {
    editCommentBtn.addEventListener("click", function () {
      const commentText = this.parentElement.querySelector(".comment-text");
      const commentInput = document.createElement("input");
      commentInput.value = commentText.textContent;
      commentInput.classList.add("comment-input");

      // Replace the comment text with the input field
      commentText.replaceWith(commentInput);

      // Show the input field and focus on it
      commentInput.style.display = "block";
      commentInput.focus();

      // Add event listener to save changes on Enter key press or blur
      commentInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          // Save changes and update the comment text
          commentText.textContent = this.value;

          // Replace the input field with the updated comment text
          this.replaceWith(commentText);
        }
      });

      // Add event listener to save changes on blur (when clicking outside the input field)
      commentInput.addEventListener("blur", function () {
        // Save changes and update the comment text
        commentText.textContent = this.value;

        // Replace the input field with the updated comment text
        this.replaceWith(commentText);
      });
    });
  });

