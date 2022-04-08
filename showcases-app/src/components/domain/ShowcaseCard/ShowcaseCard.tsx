import classNames from 'classnames';
import { IShowcase } from 'components/show-cases';
import { Link } from 'react-router-dom';
import { buildInternalRoute } from 'lib/paths';
import { configFromParams, searchParamsFromState } from 'lib/routing';
import { ReactComponent as CaretRight } from './caret-right.svg';
import { ReactComponent as CodesandboxLogo } from './codesandbox-logo.svg';
import { ReactComponent as GithubLogo } from './github-logo.svg';
import styles from './ShowcaseCard.module.css';
import React from 'react';

interface IShowCaseCard {
  showcase: IShowcase;
  config: any;
  isActive: boolean;
  onConfigChange: (config: any) => void;
}
interface IConditionalWrapper {
  condition: boolean;
  wrapper: (children: any) => JSX.Element;
  wrapper2: (children: any) => JSX.Element;
  children: any;
}
const ConditionalWrapper = ({
  condition,
  wrapper,
  wrapper2,
  children
}: IConditionalWrapper) => (condition ? wrapper(children) : wrapper2(children));

const ShowCaseCard = ({
  showcase,
  config,
  isActive,
  onConfigChange
}: IShowCaseCard) => {
  const isPreRendering = navigator.userAgent === 'ReactSnap';

  return (
    <li key={showcase.title} id={isActive ? 'showcase-card-active' : ''}>
      <ConditionalWrapper
        condition={isActive}
        wrapper2={(children) => (
          <Link
            to={{
              pathname: buildInternalRoute(showcase.id),
              search: searchParamsFromState(
                configFromParams(showcase.availableConfig, {})
              ).toString()
            }}
            onClick={() =>
              onConfigChange(configFromParams(showcase.availableConfig, {}))
            }
            className={classNames(styles.wrapper, 'space-y-2')}
          >
            {children}
          </Link>
        )}
        wrapper={(children) => (
          <div
            className={classNames(
              styles.wrapper,
              styles.wrapperActive,
              'space-y-2'
            )}
          >
            {children}
          </div>
        )}
      >
        <div>
          <h2
            className={classNames('h5', styles.title, {
              [styles.titleActive]: isActive
            })}
          >
            {showcase.title}
          </h2>
          <span className={'paragraphSmall'}>{showcase.description}</span>
        </div>
        {!isPreRendering && isActive && (
          <>
            {showcase.configuratorComponent &&
              React.createElement(showcase.configuratorComponent, {
                key: 'configurator-component',
                onChange: onConfigChange,
                config
              })}
            <div className="mt-6 flex items-center justify-between" id="Abc">
              <div className="flex items-center space-x-3">
                {showcase.codesandboxLink && (
                  <a
                    className={styles.linkIconCodesandbox}
                    href={showcase.codesandboxLink}
                    target={'_blank'}
                    rel="noreferrer"
                    title="Codesandbox"
                  >
                    <CodesandboxLogo />
                  </a>
                )}
                {showcase.githubLink && (
                  <a
                    className={styles.linkIconGithub}
                    href={showcase.githubLink}
                    target={'_blank'}
                    rel="noreferrer"
                    title="Github"
                  >
                    <GithubLogo />
                  </a>
                )}
              </div>
              {showcase.documentationLink && (
                <a
                  className="button button--ghost flex items-center space-x-2 px-4 py-2 text-sm font-bold text-blue-600"
                  href={showcase.documentationLink}
                  target={'_blank'}
                  rel="noreferrer"
                >
                  <span className="block">Documentation</span>
                  <span className="block">
                    <CaretRight />
                  </span>
                </a>
              )}
            </div>
          </>
        )}
      </ConditionalWrapper>
    </li>
  );
};

export default ShowCaseCard;
