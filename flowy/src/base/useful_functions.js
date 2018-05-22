export {extract, cloneAndModify, getTagsInTasks};


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

function getTagsInTasks(tasks) {
    return tasks.map(task => {
        let tagsInContent = getTagsInString(task.content);
        if ((typeof task.tasks !== "undefined") && task.tasks.length > 0) {
            return tagsInContent.concat(getTagsInTasks(task.tasks));
        }
        return tagsInContent;
    }).flatten().unique();
};

"abc #def ghi".split(" ").map(s => {
    if ((s.length > 0) && (s[0] === "#")) {
        return `<p class='tagLink'>${s}</p>`;
    }
    return s;
}).join(" ");