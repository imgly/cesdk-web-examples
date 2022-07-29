import { IShowcase, SHOWCASES } from 'components/show-cases';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import { buildInternalRoute } from './paths';
import {
  configFromParams,
  paramsFromUrl,
  searchParamsFromState
} from './routing';
import useDebounce from './useDebounce';

interface ActiveShowcaseValue {
  activeShowcase: IShowcase;
  activeShowcaseConfig: any;
  setActiveShowcaseConfig: Dispatch<SetStateAction<{}>>;
}
const ActiveShowcaseContext = createContext<ActiveShowcaseValue | undefined>(
  undefined
);
const ActiveShowcaseProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const params = paramsFromUrl(window.location.search);

  const activeShowcase = useMemo(
    () =>
      SHOWCASES.find(({ id }) =>
        location.pathname.startsWith(buildInternalRoute(id))
      ) || SHOWCASES[0],
    [location]
  );
  const [activeShowcaseConfig, setActiveShowcaseConfig] = useState(
    configFromParams(activeShowcase?.availableConfig, params)
  );

  useEffect(() => {
    const currentConfig = configFromParams(
      activeShowcase?.availableConfig,
      params
    );
    if (currentConfig !== activeShowcaseConfig) {
      setActiveShowcaseConfig(currentConfig);
    }
    // We only want to do this once onload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add current parameters to url for linking
  const debouncedActiveShowcaseConfig = useDebounce(activeShowcaseConfig, 500);
  useEffect(() => {
    const params =
      '?' + searchParamsFromState(debouncedActiveShowcaseConfig).toString();
    const urlString =
      window.location.toString().split('?')[0] +
      (params.length > 1 ? params : '');
    const url = new URL(urlString);

    window.history.pushState({}, '', url);
  }, [activeShowcaseConfig, debouncedActiveShowcaseConfig]);

  return (
    <ActiveShowcaseContext.Provider
      value={{ activeShowcase, activeShowcaseConfig, setActiveShowcaseConfig }}
    >
      {children}
    </ActiveShowcaseContext.Provider>
  );
};

function useActiveShowcase() {
  const context = useContext(ActiveShowcaseContext);
  if (context === undefined) {
    throw new Error(
      'useActiveShowcase must be used within a ShowcaseConfigProvider'
    );
  }
  return context;
}

export { ActiveShowcaseProvider, useActiveShowcase };
