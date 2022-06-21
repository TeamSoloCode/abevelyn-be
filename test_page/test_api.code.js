const invalidURL = React.useCallback(async () => {
  try {
    const response = await fetchData('http://localhost:300/invalidURL');

    setPageData({ data: JSON.stringify(response?.data || {}) });
  } catch (e) {
    setPageData({ data: e });
  }
}, [setPageData]);

const fetchErrorFromBE = React.useCallback(async () => {
  try {
    const response = await fetchData(
      'http://localhost:3000/products/<Not exists product>',
    );

    setPageData({ data: JSON.stringify(response?.data || {}) });
  } catch (e) {
    setPageData({ data: e });
  }
}, [setPageData]);

const fetchSuccess = React.useCallback(async () => {
  try {
    const response = await fetchData(
      'http://localhost:3000/products/0156f421-d727-41c7-b60e-50c3e3b82613',
    );

    setPageData({ data: JSON.stringify(response?.data || {}) });
  } catch (e) {
    setPageData({ data: e });
  }
}, [setPageData]);

exportPageContext({
  invalidURL,
  fetchErrorFromBE,
  fetchSuccess,
});
