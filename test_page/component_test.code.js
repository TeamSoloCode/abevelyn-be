React.useEffect(() => {}, []);

exportPageContext({
  updateDataFunction: () => {
    setPageData({ test_data: 'component_test_' + Date.now() });
  },
});
