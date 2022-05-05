React.useEffect(() => {
  const intervalID = setInterval(() => {
    logger.log(`This is home page ${Date.now()}`);
  }, 2000);

  return () => {
    clearInterval(intervalID);
  };
}, []);
