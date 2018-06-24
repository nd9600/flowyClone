export {TaskObject, getTagsInString, filters};

// constructors don't work with Jest apparently (since it uses Node?), so we can't use them
function TaskObject(obj: Task) {
        this.id = obj.id;
        this.content = obj.content;
        this.description = obj.description || "";

        this.complete = obj.complete || false;
        this.author = obj.author || "";
        this.link = obj.link || "";

        this.tasks = obj.tasks || [];
        this.parent = obj.parent || null;

        this.bold = obj.bold || false;
}

// a tag is a word that starts with a #
function getTagsInString(str: string) {
    return str.split(" ").filter(s => (s.length > 1) && (s[0] === "#"));
}

const filters = {
    all: function (tasks: Task[]) {
        return tasks
    },
    active: function (tasks: Task[]) {
        return tasks.filter(function (task) {
            return !task.complete
        });
    },
    completed: function (tasks: Task) {
        return tasks.filter(function (task) {
            return task.complete
        });
    }
};