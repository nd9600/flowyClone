import {extract} from "./useful_functions.js";

export {Task, getTagsInTask, getTagsInTasks, filters};

class Task {
    constructor(obj) {
        this.id = obj.id;
        this.content = obj.content;
        this.description = obj.description || "";

        this.complete = obj.complete || false;
        this.author = obj.author || "";
        this.link = obj.link || "";

        this.tasks = obj.tasks || [];
        this.parent = obj.parent || null;
    }
}

// a tag is a word that starts with a #
function getTagsInString(str) {
    return str.split(" ").filter(s => (s.length > 1) && (s[0] === "#"));
}

function getTagsInTask(task) {
    let tagsInContent = getTagsInString(task.content);
    let tagsInDescription = getTagsInString(task.description);
    let tagsToReturn = tagsInContent.concat(tagsInDescription);
    if ((typeof task.tasks !== "undefined") && task.tasks.length > 0) {
        tagsToReturn = tagsToReturn.concat(getTagsInTasks(task.tasks));
    }
    return tagsToReturn.unique();
};

function getTagsInTasks(tasks) {
    //we need to flatten the map's result as it returns an array of arrays
    return tasks.map(task => getTagsInTask(task)).flatten().unique();
};

let filters = {
    all: function (tasks) {
        return tasks
    },
    active: function (tasks) {
        return tasks.filter(function (task) {
            return ! task.complete
        });
    },
    completed: function (tasks) {
        return tasks.filter(function (task) {
            return task.complete
        });
    }
};