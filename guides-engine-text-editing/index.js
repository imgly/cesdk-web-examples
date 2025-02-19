import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/assets'
};

CreativeEngine.init(config, document.getElementById('cesdk_canvas')).then(
  async (instance) => {
    // highlight-editmode
    instance.editor.setEditMode('Transform');
    instance.editor.onStateChanged(() => {
      console.log('EditMode is ', instance.editor.getEditMode());
    });
    // highlight-editmode

    // highlight-blur
    document.addEventListener('cesdk-blur', (event) => {
      const relatedTarget = event.detail;

      if (focusShouldStayOnEngine(relatedTarget)) {
        event.preventDefault();
      } else if (engineShouldExitTextMode(relatedTarget)) {
        instance.editor.setEditMode('Transform');
      }
    });

    function focusShouldStayOnEngine(newActiveElement) {
      // When clicking on blank space, don't blur the engine input
      return newActiveElement == null;
    }

    function engineShouldExitTextMode() {
      return false;
    }
    // highlight-blur

    // highlight-refocus
    document.addEventListener('cesdk-refocus', (event) => {
      const relatedTarget = event.detail;

      if (focusShouldStayOnUI(relatedTarget)) {
        event.preventDefault();
      }
    });

    function focusShouldStayOnUI(newActiveElement) {
      // User might have clicked a button that opens a dialog
      // Afterwards we want an input in the dialog to receive focus
      return newActiveElement?.id === 'open-dialog';
    }
    // highlight-refocus

    await instance.scene.loadFromURL(
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene'
    );
  }
);
