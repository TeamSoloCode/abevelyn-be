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
    genTestURL('3e6ed68a-6ed8-4e47-bae8-d4743e436840'),
    genTestURL('486511d2-0bdb-441e-b4c7-1b743f1e25d4'),
    genTestURL('72f93f35-505f-483a-8378-2dfb2a11ca63'),
    genTestURL('80918b80-0051-4a80-bec9-67466b6a9d3d'),
  ]);
  console.log('abcd multiFetch', abcd);
};

const postRequest = async () => {
  try {
    const response = await fetchData('http://localhost:3000/auth/signin', {
      method: 'post',
      body: { username: 'abcdef', password: '12345' },
    });

    setPageData({ data: JSON.stringify(response || {}) });
  } catch (e) {
    setPageData({ data: e });
  }
};

exportPageContext({
  invalidURL,
  fetchErrorFromBE,
  fetchSuccess,
  multiFetch,
  postRequest,
});
