<template>
    <div id="home">
        <h1>Home</h1>
        <div id="tags">
            Tags here
        </div>
        <div id="content">
            <ul>
                <li v-for="task in tasks">{{task.content}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
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
                {content: 1},
                {content: 2},
                {content: 3},
            ]);
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
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

h1, h2 {
    font-weight: normal;
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
</style>
