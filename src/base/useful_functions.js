export {extract, cloneAndModify, getTagsInTask, getTagsInTasks};


Array.prototype.unique = function() {
    return this.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse);
};

Array.prototype.flatten = function() {
    return [].concat(...this);
};

// extracts all keys in vs from an object
function extract(obj, vs) {
    let new_obj = {};
    vs.forEach((v) => {
        new_obj[v] = obj[v];
    });
    return new_obj;
}


// clones an object and changes some of its properties
function cloneAndModify(obj, properties) {
    return Object.assign(JSON.parse(JSON.stringify(obj)), properties);
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