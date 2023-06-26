let sortByDateDescending = false; // Filter trackers
let sortByUpvotesDescending = false;

const createPostCardHTML = (post, index) => {
  const postDate = moment(post.date);
  const relativeTime = postDate.fromNow();
  const postId = `post-${index}`;

  return `
    <div class="row d-flex justify-content-center">
      <div class="col-md-7">
        <div class="card mt-2 mb-0">
          <div class="card-body rounded">
            <div class="d-flex flex-row justify-content-start align-baseline">
              <a href="#" class="card-title link-underline link-underline-opacity-0">${post.title}</a>
              <span class="post-author ms-1 pt-2">
                <a href="${post.profileLink}" class="post-author-link link-underline link-underline-opacity-0">• Posted by ${post.author}</a>
                <span class="post-date">${relativeTime}</span>
              </span>
            </div>
            <p class="card-text custom-truncate">${post.body}</p>
            <div class="flex-center iconGrid">
              <i id="upvoteIcon-${postId}" class="bi bi-caret-up iconGrid-upvote iconGrid-color"></i>
              <span id="voteCount-${postId}" class="iconGrid-text mx-1">${post.totalVote}</span>
              <i id="downvoteIcon-${postId}" class="bi bi-caret-down iconGrid-downvote iconGrid-color"></i>
              <i class="bi bi-chat-right-text ms-3 iconGrid-comment iconGrid-color"></i>
              <span class="iconGrid-text mx-1">${post.totalCommentCount} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
};

const sortPosts = (sortType) => {
  if (sortType === "date") {
    sortByDateDescending = !sortByDateDescending; // Toggle filter
    sortByUpvotesDescending = false; // Reset tracker
    if (sortByDateDescending) {
      posts.sort((a, b) => moment(b.date).unix() - moment(a.date).unix());
    } else {
      posts.sort((a, b) => moment(a.date).unix() - moment(b.date).unix());
    }
  } else if (sortType === "upvotes") {
    sortByUpvotesDescending = !sortByUpvotesDescending;
    sortByDateDescending = false;
    if (sortByUpvotesDescending) {
      posts.sort((a, b) => b.totalVote - a.totalVote);
    } else {
      posts.sort((a, b) => a.totalVote - b.totalVote);
    }
  }
  renderPosts();
};

const renderPosts = () => {
  const postsGrid = document.querySelector(".js-posts-grid");
  postsGrid.innerHTML = "";

  // Get the search query from the input field
  const searchQuery = searchInput.value.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const lowercaseTitle = post.title.toLowerCase();
    const lowercaseBody = post.body.toLowerCase();
    return (
      lowercaseTitle.includes(searchQuery) ||
      lowercaseBody.includes(searchQuery)
    );
  });

  filteredPosts.forEach((post, index) => {
    const postHTML = createPostCardHTML(post, index);
    const postElement = document.createElement("div");
    postElement.innerHTML = postHTML;

    const postId = `post-${index}`;
    const upvoteIcon = postElement.querySelector(`#upvoteIcon-${postId}`);
    const downvoteIcon = postElement.querySelector(`#downvoteIcon-${postId}`);
    const voteCount = postElement.querySelector(`#voteCount-${postId}`);

    upvoteIcon.style.cursor = "pointer";
    downvoteIcon.style.cursor = "pointer";

    postsGrid.appendChild(postElement);
  });
};

const updateVote = (voteType, voteCount, increment, customClass) => {
  voteCount.textContent = parseInt(voteCount.textContent) + increment;
  voteType.classList.add("voted");
  voteType.classList.remove("bi-caret-up", "bi-caret-down");
  voteType.classList.add(customClass);
};

const resetVote = (voteType, originalClass) => {
  voteType.classList.remove("voted");
  voteType.className = originalClass;
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sortDate").addEventListener("click", () => {
    sortPosts("date");
  });

  document.getElementById("sortUpvotes").addEventListener("click", () => {
    sortPosts("upvotes");
  });

  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const searchQuery = searchInput.value.trim().toLowerCase();
    if (searchQuery !== "") {
      renderPosts();
    }
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      const searchQuery = searchInput.value.trim().toLowerCase();
      if (searchQuery !== "") {
        renderPosts();
      }
    }
  });

  sortPosts("date");
  renderPosts();
});
