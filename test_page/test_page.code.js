const [testState, setTestState] = React.useState('Init state');

const test = React.useMemo(() => {
  return 'mlem mlem';
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
    setTestState(`Updated react hook state ${Date.now()}`);
    setPageData({ test: Date.now() });
  },
});
