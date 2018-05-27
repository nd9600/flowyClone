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

function getTasksByActivityInTask(task, activity) {
    let tasksToReturn = [];
    let selectCompletedTasks = (activity !== "active");

    let tasksToPickFromInnerTasks = task.tasks.filter(taskInArray => taskInArray.complete === selectCompletedTasks);

    if (task.complete === selectCompletedTasks) {
        let newTask = extract(task, Object.keys(task).diff(["tasks"]));
        newTask["tasks"] = tasksToPickFromInnerTasks;
        tasksToReturn.push(task);
    } else {
        tasksToReturn.push(...tasksToPickFromInnerTasks);
    }
    // if ((typeof task.tasks !== "undefined") && task.tasks.length > 0) {
    //     tasksToReturn.push(getTasksByActivityInTasks(task.tasks));
    // }
    console.log(tasksToReturn);
    return tasksToReturn;
}

function getTasksByActivityInTasks(tasks, activity) {
    return tasks.map(task => getTasksByActivityInTask(task, activity));
}

let filters = {
    all: function (tasks) {
        return tasks
    },
    active: function (tasks) {
        let a = getTasksByActivityInTasks(tasks, "active").flatten();
        console.log(a);
        return a;
    },
    completed: function (tasks) {
        return getTasksByActivityInTasks(tasks, "completed").flatten();
    }
};