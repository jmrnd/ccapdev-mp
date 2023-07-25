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
