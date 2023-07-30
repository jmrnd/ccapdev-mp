// SORT POSTS
let activeSort = -1; // Default (0 - Date, 1 - Votes)

const toggleSort = (sortOption) => {
  if (activeSort !== sortOption) {
    const sortDateBtn = document.getElementById("sortDate");
    const sortUpvotesBtn = document.getElementById("sortUpvotes");

    sortDateBtn.classList.toggle("active", sortOption === 0);
    sortUpvotesBtn.classList.toggle("active", sortOption === 1);

    activeSort = sortOption;

    const postsContainer = document.getElementById("postsContainer");
    const posts = Array.from(postsContainer.getElementsByClassName("post-card"));

    posts.sort((postA, postB) => {
      const dateA = new Date(postA.getAttribute("data-date"));
      const dateB = new Date(postB.getAttribute("data-date"));
      const upvotesA = Number(postA.getAttribute("data-upvotes"));
      const upvotesB = Number(postB.getAttribute("data-upvotes"));

      if (activeSort === 0) {
        // Sort by Date
        return dateB - dateA;
      } else {
        // Sort by Upvotes
        return upvotesB - upvotesA;
      }
    });

    postsContainer.innerHTML = "";
    posts.forEach((post) => {
      postsContainer.appendChild(post);
    });
  }
};

const sortDateBtn = document.getElementById("sortDate");
const sortUpvotesBtn = document.getElementById("sortUpvotes");

sortDateBtn.classList.toggle("active", activeSort === 0);
sortUpvotesBtn.classList.toggle("active", activeSort === 1);

// Add event listeners for the first time
sortDateBtn.addEventListener("click", () => toggleSort(0));
sortUpvotesBtn.addEventListener("click", () => toggleSort(1));

// DELETE POST CONFIRMATION
const deleteButtons = document.querySelectorAll(".delete-post-button");

deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const confirmation = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (confirmation) {
            const postId = deleteButton.dataset.id; // access the data-id attribute
            console.log(`Attempting to delete post with id ${postId}.`);

            try {
                const response = await fetch(`/delete-post/${postId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    console.log("Post deleted successfully.");
                    alert("Post deleted successfully."); // Show a success notification
                    window.location.href = "/"; // Redirect to home page or any other page
                } else {
                    console.error("Failed to delete post.");
                    alert("Failed to delete post."); // Show an error notification
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Error deleting post."); // Show an error notification
            }
        }
    });
});