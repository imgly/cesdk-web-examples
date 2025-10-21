function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];

        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  const target = {};
  const sourceKeys = Object.keys(source);
  let key;
  let i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const checkIsString = /* #__PURE__ */ getRefinement((value) => {
  return typeof value === 'string' ? value : null;
});
const isDefined = function isDefined(x) {
  return x !== null && x !== undefined;
};
function getRefinement(getB) {
  return function (a) {
    return isDefined(getB(a));
  };
}
const checkIsNonEmptyArray = function checkIsNonEmptyArray(a) {
  return a.length > 0;
};

/** Takes a dictionary containing nullish values and returns a dictionary of all the defined
 * (non-nullish) values.
 */

const compactDefined = function compactDefined(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    let _ref;

    const value = obj[key];
    return {
      ...acc,
      ...(isDefined(value) ? ((_ref = {}), (_ref[key] = value), _ref) : {})
    };
  }, {});
};
function flow() {
  for (
    var _len = arguments.length, fns = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    fns[_key] = arguments[_key];
  }

  const len = fns.length - 1;
  return function () {
    for (
      var _len2 = arguments.length, x = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      x[_key2] = arguments[_key2];
    }

    let y = fns[0].apply(this, x);

    for (let i = 1; i <= len; i++) {
      y = fns[i].call(this, y);
    }

    return y;
  };
}

const checkIsObject = /* #__PURE__ */ getRefinement((response) => {
  return isDefined(response) &&
    typeof response === 'object' &&
    !Array.isArray(response)
    ? response
    : null;
});
const checkIsErrors = /* #__PURE__ */ getRefinement((errors) => {
  return Array.isArray(errors) &&
    errors.every(checkIsString) &&
    checkIsNonEmptyArray(errors)
    ? errors
    : null;
});
const checkIsApiError = /* #__PURE__ */ getRefinement((response) => {
  return checkIsObject(response) &&
    'errors' in response &&
    checkIsErrors(response.errors)
    ? {
        errors: response.errors
      }
    : null;
});
const getErrorForBadStatusCode = function getErrorForBadStatusCode(
  jsonResponse
) {
  if (checkIsApiError(jsonResponse)) {
    return {
      errors: jsonResponse.errors,
      source: 'api'
    };
  } else {
    return {
      errors: [
        'Responded with a status code outside the 2xx range, and the response body is not recognisable.'
      ],
      source: 'decoding'
    };
  }
};
const DecodingError = function DecodingError(message) {
  this.message = message;
};

const CONTENT_TYPE_RESPONSE_HEADER = 'content-type';
const CONTENT_TYPE_JSON = 'application/json';

const checkIsJsonResponse = function checkIsJsonResponse(response) {
  const contentTypeHeader = response.headers.get(CONTENT_TYPE_RESPONSE_HEADER);
  return (
    isDefined(contentTypeHeader) &&
    parse(contentTypeHeader).type === CONTENT_TYPE_JSON
  );
};
/**
 * Note: restrict the type of JSON to `AnyJson` so that `any` doesn't leak downstream.
 */

const getJsonResponse = function getJsonResponse(response) {
  if (checkIsJsonResponse(response)) {
    return response.json().catch((_err) => {
      throw new DecodingError('unable to parse JSON response.');
    });
  } else {
    throw new DecodingError('expected JSON response from server.');
  }
};

const handleFetchResponse = function handleFetchResponse(handleResponse) {
  return function (response) {
    return (
      response.ok
        ? handleResponse({
            response
          }).then((handledResponse) => {
            return {
              type: 'success',
              status: response.status,
              response: handledResponse,
              originalResponse: response
            };
          })
        : getJsonResponse(response).then((jsonResponse) => {
            return {
              type: 'error',
              status: response.status,
              ...getErrorForBadStatusCode(jsonResponse),
              originalResponse: response
            };
          })
    ).catch((error) => {
      /**
       * We want to separate expected decoding errors from unknown ones. We do so by throwing a custom
       * `DecodingError` whenever we encounter one within `handleFetchResponse` and catch them all
       * here. This allows us to easily handle all of these errors at once. Unexpected errors are not
       * caught, so that they bubble up and fail loudly.
       *
       * Note: Ideally we'd use an Either type, but this does the job without introducing dependencies
       * like `fp-ts`.
       */
      if (error instanceof DecodingError) {
        return {
          type: 'error',
          source: 'decoding',
          status: response.status,
          originalResponse: response,
          errors: [error.message]
        };
      } else {
        throw error;
      }
    });
  };
};
const castResponse = function castResponse() {
  return function (_ref) {
    const response = _ref.response;
    return getJsonResponse(response);
  };
};

const addQueryToUrl = function addQueryToUrl(query) {
  return function (url) {
    Object.keys(query).forEach((queryKey) => {
      return url.searchParams.set(queryKey, query[queryKey].toString());
    });
  };
};

const addPathnameToUrl = function addPathnameToUrl(pathname) {
  return function (url) {
    // When there is no existing pathname, the value is `/`. Appending would give us a URL with two
    // forward slashes. This is why we replace the value in that scenario.
    if (url.pathname === '/') {
      url.pathname = pathname;
    } else {
      url.pathname += pathname;
    }
  };
};

const buildUrl = function buildUrl(_ref) {
  const pathname = _ref.pathname;
  const query = _ref.query;
  return function (apiUrl) {
    const url = new URL(apiUrl);
    addPathnameToUrl(pathname)(url);
    addQueryToUrl(query)(url);
    return url.toString();
  };
};

const getQueryFromSearchParams = function getQueryFromSearchParams(
  searchParams
) {
  const query = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
};

const parseQueryAndPathname = function parseQueryAndPathname(url) {
  const _URL = new URL(url);
  const pathname = _URL.pathname;
  const searchParams = _URL.searchParams;

  const query = getQueryFromSearchParams(searchParams);
  return {
    query,
    pathname: pathname === '/' ? undefined : pathname
  };
};

/**
 * helper used to type-check the arguments, and add default params for all requests
 */

const createRequestHandler = function createRequestHandler(fn) {
  return function (a, additionalFetchOptions) {
    if (additionalFetchOptions === void 0) {
      additionalFetchOptions = {};
    }

    const _fn = fn(a);
    const headers = _fn.headers;
    const query = _fn.query;
    const baseReqParams = _objectWithoutPropertiesLoose(_fn, [
      'headers',
      'query'
    ]);

    return {
      ...baseReqParams,
      ...additionalFetchOptions,
      query,
      headers: { ...headers, ...additionalFetchOptions.headers }
    };
  };
};
const makeEndpoint = function makeEndpoint(endpoint) {
  return endpoint;
};
const initMakeRequest = function initMakeRequest(_ref) {
  const accessKey = _ref.accessKey;
  const _ref$apiVersion = _ref.apiVersion;
  const apiVersion = _ref$apiVersion === void 0 ? 'v1' : _ref$apiVersion;
  const _ref$apiUrl = _ref.apiUrl;
  const apiUrl =
    _ref$apiUrl === void 0 ? 'https://api.unsplash.com' : _ref$apiUrl;
  const generalHeaders = _ref.headers;
  const providedFetch = _ref.fetch;
  const generalFetchOptions = _objectWithoutPropertiesLoose(_ref, [
    'accessKey',
    'apiVersion',
    'apiUrl',
    'headers',
    'fetch'
  ]);

  return function (_ref2) {
    const handleResponse = _ref2.handleResponse;
    const handleRequest = _ref2.handleRequest;
    return flow(handleRequest, (_ref3) => {
      const pathname = _ref3.pathname;
      const query = _ref3.query;
      const _ref3$method = _ref3.method;
      const method = _ref3$method === void 0 ? 'GET' : _ref3$method;
      const endpointHeaders = _ref3.headers;
      const body = _ref3.body;
      const signal = _ref3.signal;
      const url = buildUrl({
        pathname,
        query
      })(apiUrl);

      const fetchOptions = {
        method,
        headers: {
          ...generalHeaders,
          ...endpointHeaders,
          'Accept-Version': apiVersion,
          ...(isDefined(accessKey)
            ? {
                Authorization: `Client-ID ${accessKey}`
              }
            : {})
        },
        body,
        signal,
        ...generalFetchOptions
      };

      const fetchToUse = providedFetch != null ? providedFetch : fetch;
      return fetchToUse(url, fetchOptions).then(
        handleFetchResponse(handleResponse)
      );
    });
  };
};

const TOTAL_RESPONSE_HEADER = 'x-total';

const getTotalFromApiFeedResponse = function getTotalFromApiFeedResponse(
  response
) {
  const totalsStr = response.headers.get(TOTAL_RESPONSE_HEADER);

  if (isDefined(totalsStr)) {
    const total = parseInt(totalsStr);

    if (Number.isInteger(total)) {
      return total;
    } else {
      throw new DecodingError(
        `expected ${TOTAL_RESPONSE_HEADER} header to be valid integer.`
      );
    }
  } else {
    throw new DecodingError(
      `expected ${TOTAL_RESPONSE_HEADER} header to exist.`
    );
  }
};

const handleFeedResponse = function handleFeedResponse() {
  return function (_ref) {
    const response = _ref.response;
    return castResponse()({
      response
    }).then((results) => {
      return {
        results,
        total: getTotalFromApiFeedResponse(response)
      };
    });
  };
};

const getCollections = function getCollections(collectionIds) {
  return isDefined(collectionIds)
    ? {
        collections: collectionIds.join()
      }
    : {};
};
const getTopics = function getTopics(topicIds) {
  return isDefined(topicIds)
    ? {
        topics: topicIds.join()
      }
    : {};
};
const getFeedParams = function getFeedParams(_ref) {
  const page = _ref.page;
  const perPage = _ref.perPage;
  const orderBy = _ref.orderBy;
  return compactDefined({
    per_page: perPage,
    order_by: orderBy,
    page
  });
};

const COLLECTIONS_PATH_PREFIX = '/collections';
const getPhotos = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref) {
    const collectionId = _ref.collectionId;
    return `${COLLECTIONS_PATH_PREFIX}/${collectionId}/photos`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref2) => {
      const collectionId = _ref2.collectionId;
      const orientation = _ref2.orientation;
      const paginationParams = _objectWithoutPropertiesLoose(_ref2, [
        'collectionId',
        'orientation'
      ]);

      return {
        pathname: getPathname({
          collectionId
        }),
        query: compactDefined({
          ...getFeedParams(paginationParams),
          orientation
        })
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
const get = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref3) {
    const collectionId = _ref3.collectionId;
    return `${COLLECTIONS_PATH_PREFIX}/${collectionId}`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref4) => {
      const collectionId = _ref4.collectionId;
      return {
        pathname: getPathname({
          collectionId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
const list = /* #__PURE__ */ (function () {
  const getPathname = function getPathname() {
    return COLLECTIONS_PATH_PREFIX;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((paginationParams) => {
      if (paginationParams === void 0) {
        paginationParams = {};
      }

      return {
        pathname: getPathname(),
        query: getFeedParams(paginationParams)
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
const getRelated = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref5) {
    const collectionId = _ref5.collectionId;
    return `${COLLECTIONS_PATH_PREFIX}/${collectionId}/related`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref6) => {
      const collectionId = _ref6.collectionId;
      return {
        pathname: getPathname({
          collectionId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();

const index = {
  __proto__: null,
  getPhotos,
  get,
  list,
  getRelated
};

const PHOTOS_PATH_PREFIX = '/photos';
const list$1 = /* #__PURE__ */ (function () {
  const _getPathname = function getPathname() {
    return PHOTOS_PATH_PREFIX;
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname();
    },
    handleRequest: createRequestHandler((feedParams) => {
      if (feedParams === void 0) {
        feedParams = {};
      }

      return {
        pathname: PHOTOS_PATH_PREFIX,
        query: compactDefined(getFeedParams(feedParams))
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
const get$1 = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref) {
    const photoId = _ref.photoId;
    return `${PHOTOS_PATH_PREFIX}/${photoId}`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref2) => {
      const photoId = _ref2.photoId;
      return {
        pathname: getPathname({
          photoId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
const getStats = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref3) {
    const photoId = _ref3.photoId;
    return `${PHOTOS_PATH_PREFIX}/${photoId}/statistics`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref4) => {
      const photoId = _ref4.photoId;
      return {
        pathname: getPathname({
          photoId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
const getRandom = /* #__PURE__ */ (function () {
  const getPathname = function getPathname() {
    return `${PHOTOS_PATH_PREFIX}/random`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_temp) => {
      const _ref5 = _temp === void 0 ? {} : _temp;
      const collectionIds = _ref5.collectionIds;
      const contentFilter = _ref5.contentFilter;
      const topicIds = _ref5.topicIds;
      const queryParams = _objectWithoutPropertiesLoose(_ref5, [
        'collectionIds',
        'contentFilter',
        'topicIds'
      ]);

      return {
        pathname: getPathname(),
        query: compactDefined({
          ...queryParams,
          content_filter: contentFilter,
          ...getCollections(collectionIds),
          ...getTopics(topicIds)
        }),
        headers: {
          /**
           * Avoid response caching
           */
          'cache-control': 'no-cache'
        }
      };
    }),
    handleResponse: castResponse()
  });
})();
const trackDownload = {
  handleRequest: /* #__PURE__ */ createRequestHandler((_ref6) => {
    const downloadLocation = _ref6.downloadLocation;

    const _parseQueryAndPathnam = parseQueryAndPathname(downloadLocation);
    const pathname = _parseQueryAndPathnam.pathname;
    const query = _parseQueryAndPathnam.query;

    if (!isDefined(pathname)) {
      throw new Error('Could not parse pathname from url.');
    }

    return {
      pathname,
      query: compactDefined(query)
    };
  }),
  handleResponse: /* #__PURE__ */ castResponse()
};

const index$1 = {
  __proto__: null,
  list: list$1,
  get: get$1,
  getStats,
  getRandom,
  trackDownload
};

const SEARCH_PATH_PREFIX = '/search';
const getPhotos$1 = /* #__PURE__ */ (function () {
  const _getPathname = function getPathname() {
    return `${SEARCH_PATH_PREFIX}/photos`;
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname();
    },
    handleRequest: createRequestHandler((_ref) => {
      const query = _ref.query;
      const page = _ref.page;
      const perPage = _ref.perPage;
      const orderBy = _ref.orderBy;
      const collectionIds = _ref.collectionIds;
      const lang = _ref.lang;
      const contentFilter = _ref.contentFilter;
      const filters = _objectWithoutPropertiesLoose(_ref, [
        'query',
        'page',
        'perPage',
        'orderBy',
        'collectionIds',
        'lang',
        'contentFilter'
      ]);

      return {
        pathname: _getPathname(),
        query: compactDefined({
          query,
          content_filter: contentFilter,
          lang,
          order_by: orderBy,
          ...getFeedParams({
            page,
            perPage
          }),
          ...getCollections(collectionIds),
          ...filters
        })
      };
    }),
    handleResponse: castResponse()
  });
})();
const getCollections$1 = /* #__PURE__ */ (function () {
  const _getPathname2 = function getPathname() {
    return `${SEARCH_PATH_PREFIX}/collections`;
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname2();
    },
    handleRequest: createRequestHandler((_ref2) => {
      const query = _ref2.query;
      const paginationParams = _objectWithoutPropertiesLoose(_ref2, ['query']);

      return {
        pathname: _getPathname2(),
        query: {
          query,
          ...getFeedParams(paginationParams)
        }
      };
    }),
    handleResponse: castResponse()
  });
})();
const getUsers = /* #__PURE__ */ (function () {
  const _getPathname3 = function getPathname() {
    return `${SEARCH_PATH_PREFIX}/users`;
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname3();
    },
    handleRequest: createRequestHandler((_ref3) => {
      const query = _ref3.query;
      const paginationParams = _objectWithoutPropertiesLoose(_ref3, ['query']);

      return {
        pathname: _getPathname3(),
        query: {
          query,
          ...getFeedParams(paginationParams)
        }
      };
    }),
    handleResponse: castResponse()
  });
})();

const index$2 = {
  __proto__: null,
  getPhotos: getPhotos$1,
  getCollections: getCollections$1,
  getUsers
};

const USERS_PATH_PREFIX = '/users';
const get$2 = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref) {
    const username = _ref.username;
    return `${USERS_PATH_PREFIX}/${username}`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref2) => {
      const username = _ref2.username;
      return {
        pathname: getPathname({
          username
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
const getPhotos$2 = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref3) {
    const username = _ref3.username;
    return `${USERS_PATH_PREFIX}/${username}/photos`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref4) => {
      const username = _ref4.username;
      const stats = _ref4.stats;
      const orientation = _ref4.orientation;
      const paginationParams = _objectWithoutPropertiesLoose(_ref4, [
        'username',
        'stats',
        'orientation'
      ]);

      return {
        pathname: getPathname({
          username
        }),
        query: compactDefined({
          ...getFeedParams(paginationParams),
          orientation,
          stats
        })
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
const getLikes = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref5) {
    const username = _ref5.username;
    return `${USERS_PATH_PREFIX}/${username}/likes`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref6) => {
      const username = _ref6.username;
      const orientation = _ref6.orientation;
      const paginationParams = _objectWithoutPropertiesLoose(_ref6, [
        'username',
        'orientation'
      ]);

      return {
        pathname: getPathname({
          username
        }),
        query: compactDefined({
          ...getFeedParams(paginationParams),
          orientation
        })
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
const getCollections$2 = /* #__PURE__ */ (function () {
  const getPathname = function getPathname(_ref7) {
    const username = _ref7.username;
    return `${USERS_PATH_PREFIX}/${username}/collections`;
  };

  return makeEndpoint({
    getPathname,
    handleRequest: createRequestHandler((_ref8) => {
      const username = _ref8.username;
      const paginationParams = _objectWithoutPropertiesLoose(_ref8, [
        'username'
      ]);

      return {
        pathname: getPathname({
          username
        }),
        query: getFeedParams(paginationParams)
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();

const index$3 = {
  __proto__: null,
  get: get$2,
  getPhotos: getPhotos$2,
  getLikes,
  getCollections: getCollections$2
};

const BASE_TOPIC_PATH = '/topics';

const getTopicPath = function getTopicPath(_ref) {
  const topicIdOrSlug = _ref.topicIdOrSlug;
  return `${BASE_TOPIC_PATH}/${topicIdOrSlug}`;
};

const list$2 = /* #__PURE__ */ makeEndpoint({
  getPathname: getTopicPath,
  handleRequest: function handleRequest(_ref2) {
    const page = _ref2.page;
    const perPage = _ref2.perPage;
    const orderBy = _ref2.orderBy;
    const topicIdsOrSlugs = _ref2.topicIdsOrSlugs;
    return {
      pathname: BASE_TOPIC_PATH,
      query: compactDefined({
        ...getFeedParams({
          page,
          perPage
        }),
        ids: topicIdsOrSlugs == null ? void 0 : topicIdsOrSlugs.join(','),
        order_by: orderBy
      })
    };
  },
  handleResponse: /* #__PURE__ */ handleFeedResponse()
});
const get$3 = /* #__PURE__ */ makeEndpoint({
  getPathname: getTopicPath,
  handleRequest: function handleRequest(_ref3) {
    const topicIdOrSlug = _ref3.topicIdOrSlug;
    return {
      pathname: getTopicPath({
        topicIdOrSlug
      }),
      query: {}
    };
  },
  handleResponse: /* #__PURE__ */ castResponse()
});
const getPhotos$3 = /* #__PURE__ */ (function () {
  const getPathname = /* #__PURE__ */ flow(getTopicPath, (topicPath) => {
    return `${topicPath}/photos`;
  });
  return makeEndpoint({
    getPathname,
    handleRequest: function handleRequest(_ref4) {
      const topicIdOrSlug = _ref4.topicIdOrSlug;
      const orientation = _ref4.orientation;
      const feedParams = _objectWithoutPropertiesLoose(_ref4, [
        'topicIdOrSlug',
        'orientation'
      ]);

      return {
        pathname: getPathname({
          topicIdOrSlug
        }),
        query: compactDefined({ ...getFeedParams(feedParams), orientation })
      };
    },
    handleResponse: handleFeedResponse()
  });
})();

const index$4 = {
  __proto__: null,
  list: list$2,
  get: get$3,
  getPhotos: getPhotos$3
};

const trackNonHotLinkedPhotoView = function trackNonHotLinkedPhotoView(_ref) {
  const appId = _ref.appId;
  return function (_ref2) {
    const photoId = _ref2.photoId;
    const ids = !Array.isArray(photoId) ? [photoId] : photoId;

    if (ids.length > 20) {
      throw new Error(
        'You cannot track more than 20 photos at once. Please try again with fewer photos.'
      );
    }

    return fetch(`views.unsplash.com/v?photo_id=${ids.join()}&app_id=${appId}`);
  };
};

const internals = {
  __proto__: null,
  collections: index,
  photos: index$1,
  search: index$2,
  users: index$3,
  topics: index$4,
  trackNonHotLinkedPhotoView
};

let Language;

(function (Language) {
  Language.Afrikaans = 'af';
  Language.Amharic = 'am';
  Language.Arabic = 'ar';
  Language.Azerbaijani = 'az';
  Language.Belarusian = 'be';
  Language.Bulgarian = 'bg';
  Language.Bengali = 'bn';
  Language.Bosnian = 'bs';
  Language.Catalan = 'ca';
  Language.Cebuano = 'ceb';
  Language.Corsican = 'co';
  Language.Czech = 'cs';
  Language.Welsh = 'cy';
  Language.Danish = 'da';
  Language.German = 'de';
  Language.Greek = 'el';
  Language.English = 'en';
  Language.Esperanto = 'eo';
  Language.Spanish = 'es';
  Language.Estonian = 'et';
  Language.Basque = 'eu';
  Language.Persian = 'fa';
  Language.Finnish = 'fi';
  Language.French = 'fr';
  Language.Frisian = 'fy';
  Language.Irish = 'ga';
  Language.ScotsGaelic = 'gd';
  Language.Galician = 'gl';
  Language.Gujarati = 'gu';
  Language.Hausa = 'ha';
  Language.Hawaiian = 'haw';
  Language.Hindi = 'hi';
  Language.Hmong = 'hmn';
  Language.Croatian = 'hr';
  Language.HaitianCreole = 'ht';
  Language.Hungarian = 'hu';
  Language.Armenian = 'hy';
  Language.Indonesian = 'id';
  Language.Igbo = 'ig';
  Language.Icelandic = 'is';
  Language.Italian = 'it';
  Language.Hebrew = 'iw';
  Language.Japanese = 'ja';
  Language.Javanese = 'jw';
  Language.Georgian = 'ka';
  Language.Kazakh = 'kk';
  Language.Khmer = 'km';
  Language.Kannada = 'kn';
  Language.Korean = 'ko';
  Language.Kurdish = 'ku';
  Language.Kyrgyz = 'ky';
  Language.Latin = 'la';
  Language.Luxembourgish = 'lb';
  Language.Lao = 'lo';
  Language.Lithuanian = 'lt';
  Language.Latvian = 'lv';
  Language.Malagasy = 'mg';
  Language.Maori = 'mi';
  Language.Macedonian = 'mk';
  Language.Malayalam = 'ml';
  Language.Mongolian = 'mn';
  Language.Marathi = 'mr';
  Language.Malay = 'ms';
  Language.Maltese = 'mt';
  Language.Myanmar = 'my';
  Language.Nepali = 'ne';
  Language.Dutch = 'nl';
  Language.Norwegian = 'no';
  Language.Nyanja = 'ny';
  Language.Oriya = 'or';
  Language.Punjabi = 'pa';
  Language.Polish = 'pl';
  Language.Pashto = 'ps';
  Language.Portuguese = 'pt';
  Language.Romanian = 'ro';
  Language.Russian = 'ru';
  Language.Kinyarwanda = 'rw';
  Language.Sindhi = 'sd';
  Language.Sinhala = 'si';
  Language.Slovak = 'sk';
  Language.Slovenian = 'sl';
  Language.Samoan = 'sm';
  Language.Shona = 'sn';
  Language.Somali = 'so';
  Language.Albanian = 'sq';
  Language.Serbian = 'sr';
  Language.Sesotho = 'st';
  Language.Sundanese = 'su';
  Language.Swedish = 'sv';
  Language.Swahili = 'sw';
  Language.Tamil = 'ta';
  Language.Telugu = 'te';
  Language.Tajik = 'tg';
  Language.Thai = 'th';
  Language.Turkmen = 'tk';
  Language.Filipino = 'tl';
  Language.Turkish = 'tr';
  Language.Tatar = 'tt';
  Language.Uighur = 'ug';
  Language.Ukrainian = 'uk';
  Language.Urdu = 'ur';
  Language.Uzbek = 'uz';
  Language.Vietnamese = 'vi';
  Language.Xhosa = 'xh';
  Language.Yiddish = 'yi';
  Language.Yoruba = 'yo';
  Language.ChineseSimplified = 'zh';
  Language.ChineseTraditional = 'zh-TW';
  Language.Zulu = 'zu';
})(Language || (Language = {}));

let OrderBy;

(function (OrderBy) {
  OrderBy.LATEST = 'latest';
  OrderBy.POPULAR = 'popular';
  OrderBy.VIEWS = 'views';
  OrderBy.DOWNLOADS = 'downloads';
  OrderBy.OLDEST = 'oldest';
})(OrderBy || (OrderBy = {}));

const createApi = /* #__PURE__ */ flow(initMakeRequest, (makeRequest) => {
  return {
    photos: {
      get: makeRequest(get$1),
      list: makeRequest(list$1),
      getStats: makeRequest(getStats),
      getRandom: makeRequest(getRandom),
      trackDownload: makeRequest(trackDownload)
    },
    users: {
      getPhotos: makeRequest(getPhotos$2),
      getCollections: makeRequest(getCollections$2),
      getLikes: makeRequest(getLikes),
      get: makeRequest(get$2)
    },
    search: {
      getCollections: makeRequest(getCollections$1),
      getPhotos: makeRequest(getPhotos$1),
      getUsers: makeRequest(getUsers)
    },
    collections: {
      getPhotos: makeRequest(getPhotos),
      get: makeRequest(get),
      list: makeRequest(list),
      getRelated: makeRequest(getRelated)
    },
    topics: {
      list: makeRequest(list$2),
      get: makeRequest(get$3),
      getPhotos: makeRequest(getPhotos$3)
    }
  };
});

export { Language, OrderBy, internals as _internals, createApi };
// # sourceMappingURL=unsplash-js.esm.js.map
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

('use strict');

/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
const PARAM_REGEXP =
  /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
const TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/;
const TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
const QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;

/**
 * RegExp to match chars that must be quoted-pair in RFC 7230 sec 3.2.6
 */
const QUOTE_REGEXP = /([\\"])/g;

/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
const TYPE_REGEXP =
  /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;

/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @public
 */

function format(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('argument obj is required');
  }

  const parameters = obj.parameters;
  const type = obj.type;

  if (!type || !TYPE_REGEXP.test(type)) {
    throw new TypeError('invalid type');
  }

  let string = type;

  // append parameters
  if (parameters && typeof parameters === 'object') {
    let param;
    const params = Object.keys(parameters).sort();

    for (let i = 0; i < params.length; i++) {
      param = params[i];

      if (!TOKEN_REGEXP.test(param)) {
        throw new TypeError('invalid parameter name');
      }

      string += `; ${param}=${qstring(parameters[param])}`;
    }
  }

  return string;
}

/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @public
 */

function parse(string) {
  if (!string) {
    throw new TypeError('argument string is required');
  }

  // support req/res-like objects as argument
  const header = typeof string === 'object' ? getcontenttype(string) : string;

  if (typeof header !== 'string') {
    throw new TypeError('argument string is required to be a string');
  }

  let index = header.indexOf(';');
  const type = index !== -1 ? header.substr(0, index).trim() : header.trim();

  if (!TYPE_REGEXP.test(type)) {
    throw new TypeError('invalid media type');
  }

  const obj = new ContentType(type.toLowerCase());

  // parse parameters
  if (index !== -1) {
    let key;
    let match;
    let value;

    PARAM_REGEXP.lastIndex = index;

    while ((match = PARAM_REGEXP.exec(header))) {
      if (match.index !== index) {
        throw new TypeError('invalid parameter format');
      }

      index += match[0].length;
      key = match[1].toLowerCase();
      value = match[2];

      if (value[0] === '"') {
        // remove quotes and escapes
        value = value.substr(1, value.length - 2).replace(QESC_REGEXP, '$1');
      }

      obj.parameters[key] = value;
    }

    if (index !== header.length) {
      throw new TypeError('invalid parameter format');
    }
  }

  return obj;
}

/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @private
 */

function getcontenttype(obj) {
  let header;

  if (typeof obj.getHeader === 'function') {
    // res-like
    header = obj.getHeader('content-type');
  } else if (typeof obj.headers === 'object') {
    // req-like
    header = obj.headers && obj.headers['content-type'];
  }

  if (typeof header !== 'string') {
    throw new TypeError('content-type header is missing from object');
  }

  return header;
}

/**
 * Quote a string if necessary.
 *
 * @param {string} val
 * @return {string}
 * @private
 */

function qstring(val) {
  const str = String(val);

  // no need to quote tokens
  if (TOKEN_REGEXP.test(str)) {
    return str;
  }

  if (str.length > 0 && !TEXT_REGEXP.test(str)) {
    throw new TypeError('invalid parameter value');
  }

  return `"${str.replace(QUOTE_REGEXP, '\\$1')}"`;
}

/**
 * Class to represent a content type.
 * @private
 */
function ContentType(type) {
  this.parameters = Object.create(null);
  this.type = type;
}
