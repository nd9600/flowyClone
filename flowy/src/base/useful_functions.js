export {extract, cloneAndModify, getTagsInTasks};

Array.prototype.unique = function() {
    return this.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse)
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
};

function getTagsInString(str) {
    return str.split(" ").filter(s => (s.length > 0) && (s[0] === "#"))
};

function getTagsInTasks(tasks) {
    return tasks.map(task => getTagsInString(task.content)).flatten().unique();
}

var a = [];
for (i = 0; i < 5; i++) {
    a.push({
        content: `abc #def #d${i} #aaaa #asd1 qwert`
    });
}

getTagsInTasks(a);
