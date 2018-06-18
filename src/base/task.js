export {getTagsInString, filters};

// a tag is a word that starts with a #
function getTagsInString(str) {
    return str.split(" ").filter(s => (s.length > 1) && (s[0] === "#"));
}

const filters = {
    all: function (tasks) {
        return tasks
    },
    active: function (tasks) {
        return tasks.filter(function (task) {
            return !task.complete
        });
    },
    completed: function (tasks) {
        return tasks.filter(function (task) {
            return task.complete
        });
    }
};