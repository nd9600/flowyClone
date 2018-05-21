export {Task, Category};

class Task {
    constructor(obj) {
        this.id = obj.id;
        this.content = obj.content;
        this.complete = obj.complete || false;
        this.author = obj.author || "";
        this.link = obj.link || "";
        this.tags = obj.tags || [];
        this.tasks = obj.tasks || [];
    }
}