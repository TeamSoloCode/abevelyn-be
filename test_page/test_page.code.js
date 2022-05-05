const [testState, setTestState] = React.useState('Init state');

const test = React.useMemo(() => {
  return 'mlem mlem';
}, [testState]);

React.useEffect(() => {
  logger.log(`Test Effect ${testState}`);
}, [testState]);

React.useEffect(() => {
  logger.log(`Context data ${_contextData.abcd}`);
}, [_contextData]);

React.useEffect(() => {
  logger.log(`Context previous data ${_prevContextData?.abcd}`);
}, [_prevContextData]);

React.useEffect(() => {
  return () => {
    logger.log('Unmount test_page code');
  };
}, []);

context.testFunction = () => {
  setTestState(`Updated react hook state ${Date.now()}`);
  context.setContextData({ test: Date.now() });
};

context.goToHomePage = () => {
  context.navigateTo('home_page');
};
