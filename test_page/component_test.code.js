React.useEffect(() => {
  // console.log(`abcd component_test props ${JSON.stringify(props)}`);
}, []);

exportPageContext({
  updateDataFunction: () => {
    setPageData({ test_data: 'component_test_' + Date.now() });
  },
  updateParentData: () => {
    props.changeData();
  },
});
