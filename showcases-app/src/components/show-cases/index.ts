import ADVANCED_UI_CASE from './advanced-ui';
import DEFAULT_UI_CASE from './default-ui';
import LANGUAGE_CASE from './language';
import PLACEHOLDERS_CASE from './placeholders';
import THEMING_CASE from './theming';
import START_WITH_IMAGE_CASE from './start-with-image';
import HEADLESS_DESIGN_CASE from './headless-design';
import DASHBOARD_CASE from './dashboard';

const SHOWCASES: IShowcase[] = [
  DEFAULT_UI_CASE,
  ADVANCED_UI_CASE,
  THEMING_CASE,
  LANGUAGE_CASE,
  START_WITH_IMAGE_CASE,
  PLACEHOLDERS_CASE,
  HEADLESS_DESIGN_CASE,
  DASHBOARD_CASE
];

export interface IShowcase {
  title: string;
  description: string;
  component: (activeDemoConfig?: any) => JSX.Element;
  availableConfig?: Record<
    string,
    {
      default: string | null;
      availableValues?: string[];
    }
  >;

  configuratorComponent?: ({
    onChange,
    config
  }: {
    onChange: (config: any) => void;
    config: any;
  }) => JSX.Element;
  documentationLink?: string;
  githubLink?: string;
  codesandboxLink?: string;
  id: string;
}

export default SHOWCASES;
