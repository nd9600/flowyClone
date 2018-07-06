//https://github.com/anthonygore/vuex-undo-redo

const EMPTY_STATE = 'emptyState';

export default {
    install(Vue, options = {}) {
        Vue.mixin({
            data() {
                return {
                    done: [],
                    undone: [],
                    newMutation: true,
                    ignoreMutations: options.ignoreMutations || []
                };
            },
            created() {
                this.$store.subscribe((mutation, state) => {
                    if (mutation.type !== EMPTY_STATE && this.ignoreMutations.indexOf(mutation.type) === -1) {
                        this.done.push(mutation);
                    }
                    if (this.newMutation) {
                        this.undone = [];
                    }
                });
            },
            computed: {
                canRedo() {
                    return this.undone.length > 0;
                },
                canUndo() {
                    return this.done.length > 0;
                }
            },
            methods: {
                redo() {
                    let commit = this.undone.pop();
                    this.newMutation = false;
                    this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));
                    this.newMutation = true;
                },
                undo() {
                    console.log(this.undone);
                    console.log(this.done);

                    this.undone.push(this.done.pop());

                    console.log(this.undone);
                    console.log(this.done);

                    this.newMutation = false;
                    this.$store.commit(EMPTY_STATE);
                    this.done.forEach(mutation => {
                        this.$store.commit(`${mutation.type}`, Object.assign({}, mutation.payload));
                        this.done.pop();
                    });
                    this.newMutation = true;
                }
            }
        });
    },
}