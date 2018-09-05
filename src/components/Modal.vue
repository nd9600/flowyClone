<template>

    <transition name="modal">
        <div>

            <!-- the modal mask can't be a parent of the model, because the mask would be on-top of it, and you wouldn't be able to click on the modal -->
            <div
                class="modal-mask"
                @click="$emit('close')">
            </div>
            <div class="modal-wrapper">
                <div class="modal-container">
                    <h3 class="modal-header">
                        <slot name="header">
                        </slot>
                    </h3>
                    <div class="separator"></div>
                    <div class="modal-scrollableSection">
                        <div class="modal-body">
                            <slot name="body">
                                default body
                            </slot>
                        </div>
                        <div class="separator"></div>
                        <div class="modal-footer">
                            <slot name="footer">
                                &#8203;
                                <button
                                    class="modal-default-button"
                                    @click="$emit('close')">
                                    OK
                                </button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>

</template>

<script>
export default {
    name: "Modal"
};
</script>

<style scoped>
    .modal-mask {
        position: fixed;
        overflow: auto;
        z-index: 3;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        position: fixed;
        top: 5%;
        z-index: 100;

        /* centers vertically */
        left: 25%;
        transform: translateX(-12.5%);
        max-height: 90%;
    }

    .modal-container {
        min-width: 25vw;
        max-width: 62vw;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        max-height: 85vh;
    }

    .modal-header {
        margin: 0;
        color: #42b983;
    }

    .modal-scrollableSection {
        /* lets the modal scroll if it's too long */
        overflow-y: auto;
        max-height: 80vh;
    }

    .modal-body {
        margin: 0;
        max-width: 100%;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-start;
    }

    .modal-default-button {
        border-radius: 10px;
    }

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
