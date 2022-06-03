React.useEffect(() => {
  const intervalID = setInterval(() => {
    logger.log(`This is home page ${Date.now()}`);
  }, 2000);

  setPageData({ passedData: getPageArguments().passedData });
  (async () => {
    logger.log(`Get testCookie: ${await getCookies('testCookie')}`);
  })();
  return () => {
    clearInterval(intervalID);
  };
}, []);

exportPageContext({
  setHomePageData: () => {
    setPageData({ homePageData: Date.now() });
  },
});
