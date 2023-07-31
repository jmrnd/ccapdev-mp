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
        let upVoter = upVoters.some((user) => user.username === currentUser.username);
        let downVoter = downVoters.some((user) => user.username === currentUser.username);
        if (upVoter) {
            return "upvoter";
        } else if (downVoter) {
            return "downvoter";
        } else {
            return false;
        }
    },
    isUpvoter: function (hasVotedResponse) {
        return hasVotedResponse === "upvoter";
    }
};

export default customHelpers;
