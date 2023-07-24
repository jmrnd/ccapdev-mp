const deleteButtons = document.querySelectorAll('.delete-post-button');

deleteButtons.forEach(deleteButton => {
  deleteButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const confirmation = window.confirm('Are you sure you want to delete this post?');

    if (confirmation) {
      const postId = deleteButton.dataset.id; // access the data-id attribute
      console.log(`Attempting to delete post with id ${postId}.`);

      try {
        const response = await fetch(`/delete-post/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Post deleted successfully.');
          alert('Post deleted successfully.'); // Show a success notification
          window.location.href = '/'; // Redirect to home page or any other page
        } else {
          console.error('Failed to delete post.');
          alert('Failed to delete post.'); // Show an error notification
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post.'); // Show an error notification
      }
    }
  });
});
