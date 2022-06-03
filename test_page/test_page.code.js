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
  logger.log(`Context previous data ${_prevContextData?.abcd}`);
}, [_prevContextData]);

exportPageContext({
  goToHomePage: () => {
    navigateTo('home_page', { passedData: 'data-from-test_page' });
  },
  testFunction: () => {
    setTestState(`${Date.now()}`);
    setPageData({ test: Date.now() });
  },
});
