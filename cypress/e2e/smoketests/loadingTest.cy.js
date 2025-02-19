/// <reference types="cypress" />

const folders = [
  'configure-basics',
  'configure-callbacks',
  'configure-extensions',
  'configure-i18n',
  'configure-licensing',
  'configure-page',
  'configure-presets-colorpalettes',
  'configure-presets-pageformats',
  'configure-presets-templates',
  'configure-presets-typefaces',
  'configure-scene',
  'configure-ui-elements',
  'configure-ui-theming',
  'configure-variables',
  'guides-asset-source-api',
  'guides-create-scene-from-image-blob',
  'guides-create-scene-from-image-canvas',
  'guides-create-scene-from-image-element',
  'guides-create-scene-from-image-url',
  'guides-customize-the-asset-library',
  'guides-headless-asset-api',
  'guides-headless-block-api',
  'guides-headless-demo-house',
  'guides-headless-editor-api',
  'guides-headless-event-api',
  'guides-headless-property-api',
  'guides-headless-scene-api',
  'guides-headless-setup',
  'guides-headless-text-editing',
  'guides-headless-variable-api',
  'guides-load-scene-from-blob',
  'guides-load-scene-from-remote',
  'guides-load-scene-from-string',
  'guides-save-scene-to-blob',
  'guides-save-scene-to-string',
  'guides-scopes',
  'guides-store-metadata',
  'guides-uri-resolver'
  // The integration examples require more custom setups
  // 'integrate-with-angular',
  // 'integrate-with-electron',
  // 'integrate-with-next-js',
  // 'integrate-with-react',
  // 'integrate-with-svelte',
  // 'integrate-with-vanilla-js',
  // 'integrate-with-vue'
];

for (const folderName of folders) {
  describe(`Example ${folderName}`, () => {
    beforeEach(() => {
      cy.visit(`${folderName}/index.html`);
    });

    it('loads', () => {
      const requests = [];

      cy.intercept('*', (req) => {
        req.continue((res) => {
          requests.push({ url: req.url, statusCode: res.statusCode });
        });
      }).as('req');

      // This should be replaced by a check that the example has finished loading.
      // Like cy.window().its('testFinished').should('exist');
      // However this requires adding code to the examples, code that should not be part of the public example.
      // For now we just wait an arbitrary amount of time and assert that no error happens in this time.

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      // Make sure no http requests is erroring
      // eslint-disable-next-line @typescript-eslint/no-shadow
      cy.wrap(requests).should((requests) => {
        const failedRequests = requests.filter(
          ({ statusCode }) => statusCode !== 200 || statusCode !== 204
        );
        failedRequests.forEach((request) =>
          expect(request.statusCode).to.be.oneOf([200, 204])
        );
      });
    });
  });
}
