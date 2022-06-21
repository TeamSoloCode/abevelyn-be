const [testState, setTestState] = React.useState('Init state');

const test = React.useMemo(() => {
  return 'mlem mlem';
}, [testState]);

React.useEffect(() => {
  const cookie = `Test cookie ${testState}`;
  setCookies('testCookie', cookie);
  logger.log(`Set testCookie: ${cookie}`);
}, [testState]);

React.useEffect(() => {
  logger.log(`Test Effect ${testState}`);
}, [testState]);

React.useEffect(() => {
  // logger.log(`Page previous data ${JSON.stringify(prevPageData)}`);
}, [prevPageData]);

const getTestingData = React.useCallback(async () => {
  try {
    const response = await fetchData(
      'http://localhost:3000/products/0156f421-d727-41c7-b60e-50c3e3b82613',
    );

    setPageData({ apiData: JSON.stringify(response?.data || {}) });
  } catch (e) {
    setPageData({ apiData: e.message });
  }
}, [setPageData]);

exportPageContext({
  dataFromExportPageContext: 'CONTANST OR SOMETHING',
  goTo: (route) => {
    navigateTo(route);
  },
  getTestingData,
  goToHomePage: () => {
    navigateTo('home_page', { passedData: 'data-from-test_page' });
  },
  goFieldTestPage: () => {
    navigateTo('fields_page', { passedData: 'data-from-test_page' });
  },
  testFunction: () => {
    setTestState(`${Date.now()}`);
    setPageData({ test: Date.now() });
  },
  changeTheme: () => {
    toggleChangeTheme();
  },
  updatePageState: () => {
    setPageData({
      abcd: Date.now(),
      'text-error': !getPageData()['text-error'],
      dynamicColor: !getPageData()['text-error'] ? 'purple' : 'yellow',
      nest: { nest1: 'nest1 data' },
    });
  },
});
