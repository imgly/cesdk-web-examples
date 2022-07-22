import { snakeCase } from 'lodash';

export const paramsFromUrl = (url: string) =>
  url
    .replace(/\?/g, '')
    .split('&')
    .map((param) => param.split('='))
    .reduce((ac, [key, val], i) => ({ ...ac, [key]: val }), {});

const CONFIG_PREFIX = 'c_';
// const paramKeyToObjKey = (paramKey: string) =>
//   camelCase(paramKey.substring(CONFIG_PREFIX.length));
const ObjKeyToParamKey = (paramKey: string) =>
  CONFIG_PREFIX + snakeCase(paramKey);

export const searchParamsFromState = (config: any) => {
  let newSearchParams = new URLSearchParams();
  if (config) {
    Object.entries(config).forEach(([key, val]) =>
      newSearchParams.set(ObjKeyToParamKey(key), (val as string) || '')
    );
  }
  return newSearchParams;
};

export const configFromParams = (
  availableConfig: any,
  params: Record<string, any>
) => {
  if (!availableConfig) {
    return {};
  }
  // Override keys if they exist
  return Object.keys(availableConfig)
    .map((configKey) => {
      if (
        params[ObjKeyToParamKey(configKey)] &&
        (availableConfig[configKey].availableValues === undefined ||
          availableConfig[configKey].availableValues.includes(
            params[ObjKeyToParamKey(configKey)]
          ))
      ) {
        return [
          configKey,
          decodeURIComponent(params[ObjKeyToParamKey(configKey)])
        ];
      } else {
        return [configKey, availableConfig[configKey].default];
      }
    })
    .reduce((ac, [key, val], i) => ({ ...ac, [key]: val }), {});
};
