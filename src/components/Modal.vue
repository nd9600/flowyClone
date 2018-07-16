<template>
  
  <transition name="modal">
    <div>

      <!-- the modal mask can't be a parent of the model, because the mask would be on-top of it, and you wouldn't be able to click on the modal -->
      <div @click="$emit('close')" class="modal-mask">
      </div>
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>
          <div class="separator"></div>
          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>
          <div class="separator"></div>
          <div class="modal-footer">
            <slot name="footer">
              &#8203;
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
    export default {
        name: 'modal'
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
  top: 10%;
  vertical-align: middle;
  z-index: 100;

  /* centers vertically */
  left: 25%;
  transform: translateX(-12.5%);
}

.modal-container {
  min-width: 25vw;
  max-width: 62vw;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  max-width: 100%;
}

.modal-default-button {
  float: right;
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