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
    }
};

export default customHelpers;
