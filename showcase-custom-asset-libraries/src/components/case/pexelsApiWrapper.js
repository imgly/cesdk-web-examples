const fetchFromPexels = async (url, apiKey) => {
  const response = await fetch(`https://api.pexels.com/v1/${url}`, {
    mode: 'cors',
    headers: {
      Authorization: apiKey
    }
  });
  const json = await response.json();
  const status = response.status;
  return { data: json, status };
};

const createPexelsApi = (apiKey) => {
  return {
    photos: {
      search: async ({ query, per_page, page, locale }) => {
        const params = filterNullishAttributes({
          query,
          per_page,
          page,
          locale
        });
        const paramString = new URLSearchParams(params);
        const response = await fetchFromPexels(`search?${paramString}`, apiKey);
        return response;
      },
      curated: async ({ per_page, page, locale }) => {
        const params = filterNullishAttributes({
          per_page,
          page,
          locale
        });
        const paramString = new URLSearchParams(params);
        const response = await fetchFromPexels(
          `curated?${paramString}`,
          apiKey
        );
        return response;
      }
    }
  };
};

const filterNullishAttributes = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
  );

export { createPexelsApi };
