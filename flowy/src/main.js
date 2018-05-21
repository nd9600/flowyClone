import Vue from 'vue';

import App from './App.vue';
import TagsContainer from "./components/TagsContainer.vue";

Vue.component("tags-container", TagsContainer);

Array.prototype.unique = function() {
    return this.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse)
};

Array.prototype.flatten = function() {
    return [].concat(...this);
};

new Vue({
    el: '#app',
    render: h => h(App)
})
