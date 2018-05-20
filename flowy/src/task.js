export {Tasl, Category};

class Task {
    constructor(content, author="", link=null, tags=[]) {
        this.content = content;
        this.author = author;
        this.link = link;
        this.tags = tags;
    }
}

class Category {
    constructor(tasks, tags=[]) {
        this.tasks = tasks;
        this.tags = tags;
    }
}