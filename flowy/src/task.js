export {Task, Category};

class Task {
    constructor(content, author="", link="", tags=[], tasks=[]) {
        this.content = content;
        this.author = author;
        this.link = link;
        this.tags = tags;
        this.tasks= tasks;
    }
}

class Category {
    constructor(name, tasks=[], tags=[]) {
        this.name = name;
        this.tasks = tasks;
        this.tags = tags;
    }
}