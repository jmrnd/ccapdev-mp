document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Script is running");
    const replyButtons = document.querySelectorAll('.reply-button');
    const replyForms = document.querySelectorAll('.reply-form');

    replyButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            // Prevent the default action
            e.preventDefault();

            // Get the associated form using the data-id value
            const replyForm = document.getElementById('reply-form-' + button.dataset.id);

            // Toggle the display of the reply form
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        });
    });

    replyForms.forEach((form) => {
        form.addEventListener('submit', async function(e) {
            // Prevent the default form submission
            e.preventDefault();

            // Get the associated comment id
            const commentId = form.dataset.id;

            // Get the reply text from the form
            const replyText = form.querySelector('textarea').value;

            // Send the reply to the server
            const response = await fetch(`/create_reply/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reply: replyText }),
            });

            if (response.ok) {
                // Clear the textarea
                form.querySelector('textarea').value = '';

                // Optionally, you could fetch and display the updated list of replies here
                // Refresh the page to see the new reply
                location.reload();
            } else {
                console.error("Failed to post reply", await response.text());
            }
        });
    });
});
