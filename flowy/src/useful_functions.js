Array.prototype.unique = function() {
    return this.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse)
};

Array.prototype.flatten = function() {
    return [].concat(...this);
};

function extract(obj, vs) {
    let new_obj = {};
    vs.forEach((v) => { 
        new_obj[v] = obj[v]; 
    }); 
    return new_obj;
}
