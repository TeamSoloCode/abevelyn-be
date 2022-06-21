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

const genTestURL = async (uuid) => {
  return fetchData(`http://localhost:3000/products/${uuid}`);
};

const multiFetch = async () => {
  const abcd = await Promise.all([
    genTestURL('0156f421-d727-41c7-b60e-50c3e3b82613'),
    genTestURL('0d061d92-a73c-456e-a352-bdc1d9f65840'),
    genTestURL('219d94c2-f045-4a89-9648-d9cb75bb77f1'),
  ]);
  console.log('abcd multiFetch', abcd);
};

exportPageContext({
  invalidURL,
  fetchErrorFromBE,
  fetchSuccess,
  multiFetch,
});
