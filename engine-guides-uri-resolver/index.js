import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config).then((instance) => {
  /** This will return 'https://cdn.img.ly/packages/imgly/cesdk-js/1.65.0/assets/banana.jpg'. */
  instance.engine.editor.getAbsoluteURI('/banana.jpg');

  /** Replace all .jpg files with the IMG.LY logo! * */
  instance.engine.editor.setURIResolver((uri, defaultURIResolver) => {
    if (uri.endsWith('.jpg')) {
      return 'https://img.ly/static/ubq_samples/imgly_logo.jpg';
    }
    /** Make use of the default URI resolution behavior. */
    return defaultURIResolver(uri);
  });

  /**
   * The custom resolver will return a path to the IMG.LY logo because the given path ends with '.jpg'.
   * This applies regardless if the given path is relative or absolute.
   */
  instance.engine.editor.getAbsoluteURI('/banana.jpg');

  /** The custom resolver will not modify this path because it ends with '.png'. */
  instance.engine.editor.getAbsoluteURI('https://example.com/orange.png');

  /** Because a custom resolver is set, relative paths that the resolver does not transform remain unmodified! */
  instance.engine.editor.getAbsoluteURI('/orange.png');

  /** Removes the previously set resolver. */
  instance.engine.editor.setURIResolver(null);

  /** Since we've removed the custom resolver, this will return 'https://cdn.img.ly/packages/imgly/cesdk-js/1.65.0/assets/banana.jpg' like before. */
  instance.engine.editor.getAbsoluteURI('/banana.jpg');
});
