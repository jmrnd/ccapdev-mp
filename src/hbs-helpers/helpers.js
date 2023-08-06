import moment from "moment";

const customHelpers = {
    // Fix function (not evaluating correctly -- see index.hbs)
    isEqual: function (a, b) {
        return a === b;
    },
    formatDate: function (date) {
        let month = date.toLocaleString("default", { month: "short" });
        let day = date.getDate().toString();
        let year = date.getFullYear().toString();
        return `${month} ${day}, ${year}`;
    },
    relativeTime: function (date) {
        return moment(date).fromNow();
    },
    parseBody: function (object) {
        return JSON.parse(object);
    },
    hasVoted: function (currentUser, upVoters, downVoters) {
        let upVoter = upVoters.some((user) => user == currentUser);
        let downVoter = downVoters.some((user) => user == currentUser);
        if (upVoter || downVoter) {
            return true;
        } else {
            return false;
        }
    },
    isUpvoter: function (currentUser, upVoters) {
        let upVoter = upVoters.some((user) => user == currentUser);
        if (upVoter) {
            return true;
        } else {
            return false;
        }
    },
    getNotifHeader: function (notifClass, contentClass) {
        switch (notifClass) {
            case "Comment":
                return "commented on your post";
            case "Reply":
                return "relpied to your comment";
            case "Upvote":
                if (contentClass == "Post")
                    return "upvoted your post.";
                else 
                    return "upvoted your comment.";
            default:
                return "Notification not classified";
        }
    }
};

export default customHelpers;
