import classNames from 'classnames';
import Meta from 'components/domain/Meta/Meta';
import ShowCaseCard from 'components/domain/ShowcaseCard/ShowcaseCard';
import SHOWCASES from 'components/show-cases';
import { Header } from 'components/ui/Header/Header';
import { buildInternalRoute, EXTERNAL_PATHS, ROUTE_PREFIX } from 'lib/paths';
import {
  configFromParams,
  paramsFromUrl,
  searchParamsFromState
} from 'lib/routing';
import useDebounce from 'lib/useDebounce';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import classes from './App.module.css';

const showcases = SHOWCASES;

function App() {
  const location = useLocation();
  const params = paramsFromUrl(window.location.search);
  const sidebarNav = useRef<HTMLDivElement>(null);

  const activeShowcase = useMemo(
    () =>
      showcases.find(({ id }) =>
        location.pathname.startsWith(buildInternalRoute(id))
      ) || showcases[0],
    [location]
  );
  const [activeShowcaseConfig, setActiveShowcaseConfig] = useState(
    activeShowcase && configFromParams(activeShowcase?.availableConfig, params)
  );

  // Add current parameters to url for linking
  const debouncedActiveShowcaseConfig = useDebounce(activeShowcaseConfig, 300);
  useEffect(() => {
    const params =
      '?' + searchParamsFromState(debouncedActiveShowcaseConfig).toString();
    const urlString =
      window.location.toString().split('?')[0] +
      (params.length > 1 ? params : '');
    const url = new URL(urlString);

    window.history.pushState({}, '', url);
  }, [activeShowcase?.availableConfig, debouncedActiveShowcaseConfig]);

  // onLoad scroll active navbar item into view
  useEffect(() => {
    setTimeout(() => {
      if (sidebarNav.current) {
        const activeItemScrollTop =
          document.getElementById('showcase-card-active')?.offsetTop || 0;
        const newScrollTop = Math.max(activeItemScrollTop - 100, 0);
        sidebarNav.current.scrollTop = newScrollTop;
      }
    }, 0);
  }, []);

  return (
    <div className={classes.wrapper}>
      <Meta showcase={activeShowcase} />
      <aside className={classes.sidebar}>
        <Header />
        <nav className={classes.showcasesOverflowWrapper} ref={sidebarNav}>
          <ul className={classNames(classes.showcasesWrapper, 'space-y-2')}>
            {showcases.map((showcase) => (
              <ShowCaseCard
                config={activeShowcaseConfig}
                showcase={showcase}
                onConfigChange={(config) => {
                  setActiveShowcaseConfig(config);
                }}
                isActive={activeShowcase?.id === showcase.id}
                key={showcase.id}
              />
            ))}
          </ul>
        </nav>
        <footer className={classes.ctaFooter}>
          <a
            href={EXTERNAL_PATHS.contactSalesLink}
            target="_blank"
            rel="noreferrer"
            className="button button--light"
          >
            Contact Sales
          </a>
          <a
            href={EXTERNAL_PATHS.freeTrial}
            target="_blank"
            rel="noreferrer"
            className="button button--primary"
          >
            Free Trial
          </a>
        </footer>
      </aside>

      <div className={classes.content}>
        <Routes>
          <Route path={ROUTE_PREFIX}>
            <Route
              index
              element={React.createElement(showcases[0].component, {
                key: showcases[0].id,
                ...activeShowcaseConfig
              })}
            />
            {showcases.map(({ id, component }, index) => (
              <Route
                key={`${id}-index`}
                path={`${id}/index.html`}
                element={React.createElement(component, {
                  key: `${id}-index`,
                  ...activeShowcaseConfig
                })}
              />
            ))}
            {showcases.map(({ id, component }, index) => (
              <Route
                key={id}
                path={id}
                element={React.createElement(component, {
                  key: id,
                  ...activeShowcaseConfig
                })}
              />
            ))}
          </Route>
        </Routes>
      </div>
      <div className={classNames(classes.contentFooter, 'space-x-2')}>
        <a href={EXTERNAL_PATHS.privacyLink} target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        <a href={EXTERNAL_PATHS.imprintLink} target="_blank" rel="noreferrer">
          Imprint
        </a>
      </div>
    </div>
  );
}

export default App;
