<template>
    <div id="home">
        <h1>Home</h1>
        <div class="tagsContainer" id="tags">
            <a 
                v-for="tag in getTags"
                :href="'#' + tag"
                class="tagLink"
            >
                #{{tag}}
            </a>
        </div>
        <div id="content">
            <ul>
                <li v-for="task in tasks">
                    {{task.content}}
                    <div v-if="task.tags.length > 0" class="tagsContainer">
                        <a 
                            v-for="tag in task.tags"
                            :href="'#' + tag"
                            class="tagLink"
                        >
                            #{{tag}}
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import * as task from "./task.js";

export default {
    name: "home",
    data() {
        return {
            tasks: [],
        }
    },
    methods: {
        loadTasks: function() {
            this.tasks.push(... [
                new task.Task("t1", "", "", ["test"]),
                new task.Task("t2", "", "", ["test"]),
                new task.Task("t3", "", "", ["test3"])
            ]);
        }
    },
    computed: {
        getTags() {
            return this.tasks.map(t => t.tags).flatten();
        }
    },
    created() {
        this.loadTasks();
    }
}
</script>

<style>
#home {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 30px 0 0 30px;
}

ul {
    padding: 0;
}

li {
    margin: 0 10px;
}

a {
    color: #42b983;
}

.tagsContainer {
    display: inline;
}

.tagLink {
    color: #999;
    margin: 0 5px 0 0;
}
.tagLink:hover {
    background-color: #f2f2f2;
}
</style>
