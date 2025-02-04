import React from 'react';

const CaseComponent = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="caseHeader">
        <h3>Dashboard – Manage your Templates</h3>
        <p>
          The dashboard is where you create, import and manage your designs in
          folders and workspaces. You can invite users for collaboration and
          also share your creation as a link.
        </p>
      </div>
      <iframe
        data-cy="iframe"
        style={iframeStyle}
        title="CE.SDK Dashboard"
        src="https://ubique.img.ly/main/demos/dashboard/#/login?name=John+Doe&autologin=1"
      />
    </div>
  );
};

const iframeStyle = {
  width: '100%',
  flexGrow: 1,
  overflow: 'hidden',
  borderRadius: '12px',
  boxShadow:
    '0rem 0rem .125rem rgba(0, 0, 0, 0.25), 0rem 1.125rem 1.125rem -0.125rem rgba(18, 26, 33, 0.12), 0rem .4688rem .4688rem -0.125rem rgba(18, 26, 33, 0.12), 0rem .2344rem .2344rem -0.125rem rgba(18, 26, 33, 0.12)'
};
export default CaseComponent;
