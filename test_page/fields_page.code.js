React.useEffect(() => {
  if (!_.isEqual(pageData?.data, prevPageData?.data)) {
    setPageData({ data: JSON.stringify(pageData) });
  }
}, [pageData, setPageData]);

React.useEffect(() => {}, [pageData?.textFieldValue]);

exportPageContext({
  onTextChange: (value) => {
    setPageData({ textValue: value });
  },
  resetAllText: () => {
    setPageData({ textFieldValue: '' });
  },
});
