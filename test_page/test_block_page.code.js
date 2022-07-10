exportPageContext({
  functionUsedInComponent: () => {
    console.log('This is the function from test_block_page');
    setPageData({ test_data: 'test_block_' + Date.now() });
  },
});
