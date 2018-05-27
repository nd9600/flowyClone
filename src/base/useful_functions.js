export {extract, cloneAndModify};


Array.prototype.unique = function() {
    return this.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse);
};

Array.prototype.flatten = function() {
    return [].concat(...this);
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
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