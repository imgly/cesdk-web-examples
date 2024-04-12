import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.25.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.25.0-rc.0/assets'
};

CreativeEngine.init(config, document.getElementById('cesdk_canvas')).then(
  async (instance) => {
    // Add default assets used in scene.
    instance.addDefaultAssetSources();

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
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
    );
  }
);
