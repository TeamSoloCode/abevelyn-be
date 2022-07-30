exportPageContext({
  functionUsedInComponent: () => {
    setPageData({ parentState: 'test_block_' + Date.now() });
  },
  notRelatedUpdateState: () => {
    setPageData({ notRelated: 'notRelated_' + Date.now() });
  },
});
