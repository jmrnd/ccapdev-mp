// Hardcoded data for notifications
const notifications = [
  {
    currentUser: "joolzie123",
    fromUser: "coco_san00",
    profilePicture: "../../images/profile_pictures/coco_san00.jpeg",
    notification: "commented on your post",
    postLink: "post-joolzie123-1.html",
    notificationDetails: [
      {
        date: "2023-06-25T08:30:00Z",
        text: 'I once sent my mom a text saying, "Dinner will be owl-ready." Auto-correct turned "owl-ready" into "bowling." She thought we were having a bowling party at home!',
      },
    ],
  },
  {
    currentUser: "joolzie123",
    fromUser: "gundamn",
    profilePicture: "../../images/profile_pictures/gundamn.jpeg",
    notification: "commented on your post",
    postLink: "post-joolzie123-1.html",
    notificationDetails: [
      {
        date: "2023-06-20T10:45:00Z",
        text: 'I once texted my friend, "I\'m heading to the bar for drinks." Auto-correct changed it to "I\'m heading to the bat for drinks." Needless to say, it raised some eyebrows!',
      },
    ],
  },
  {
    currentUser: "joolzie123",
    fromUser: "cirup29",
    profilePicture: "../../images/profile_pictures/cirup29.jpeg",
    notification: "liked your post",
    postLink: "post-joolzie123-2.html",
    notificationDetails: {
      date: "2023-06-16T14:15:00Z",
      text: "Check out this awesome HTML5 trick!",
    },
  },
];

// Function to generate notification body for a single notification
function generateNotificationHTML(notification) {
  const {
    fromUser,
    profilePicture,
    notification: notificationText,
    postLink,
    notificationDetails,
  } = notification;

  const notificationDate = getRelativeTime(notificationDetails.date);
  const notificationHeaderClass = "notification-header me-2";

  let notificationHTML = `
    <li class="notification-dropdown-item">
      <a href="${postLink}" class="d-flex flex-column d-inline-block text-wrap ms-1 me-2 mt-1 link-unstyled" style="width: 20rem;">
        <div class="d-flex flex-row align-items-center text-wrap mt-2">
          <img class="rounded-circle notification-pfp mx-2" src="${profilePicture}" alt="profile_picture">
          <span class="${notificationHeaderClass}">${fromUser} ${notificationText} ${notificationDate}</span>
        </div>`;

  if (Array.isArray(notificationDetails)) {
    notificationDetails.forEach((details) => {
      const { date, text } = details;
      notificationHTML += `
        <span class="notification-body custom-truncate mx-3 mt-1" style="max-width: 20rem;">
          ${text}
        </span>`;
    });
  } else {
    const { date, text } = notificationDetails;
    notificationHTML += `
      <span class="notification-body custom-truncate mx-3 mt-1" style="max-width: 20rem;">
        ${text}
      </span>`;
  }

  notificationHTML += `
      </a>
    </li>`;

  return notificationHTML;
}

// Function to render notifications
function renderNotifications() {
  const notificationMenu = document.querySelector(
    ".nav-item.dropdown .dropdown-menu"
  );
  notificationMenu.innerHTML = `<span class="ms-3">Notifications</span>`;

  notifications.forEach((notification) => {
    const notificationHTML = generateNotificationHTML(notification);
    notificationMenu.insertAdjacentHTML("beforeend", notificationHTML);
  });
}

// Calulate relative time
function getRelativeTime(dateString) {
  const now = moment();
  const date = moment(dateString);
  const diff = now.diff(date, "minutes");

  if (diff < 1) {
    return "Just now";
  } else if (diff < 60) {
    return `${diff} min${diff > 1 ? "s" : ""} ago`;
  } else if (diff < 1440) {
    const hours = Math.floor(diff / 60);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diff / 1440);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

// Render notifications
renderNotifications();
