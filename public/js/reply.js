const replyButtons = document.querySelectorAll('.reply-button');

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
