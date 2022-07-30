React.useEffect(() => {
  // console.log(`abcd component_test props ${JSON.stringify(props)}`);
}, []);

exportPageContext({
  updateDataFunction: () => {
    setPageData({ componentState: 'component_test_' + Date.now() });
  },
  updateParentData: () => {
    props.changeData();
  },
});
