useInitState({
  textFieldValue: 'init text value',
  genderItems: ['male_1', 'female_2', 'gay_3'],
  gender: 'gay_3',
});

React.useEffect(() => {
  if (!_.isEqual(getPageData()?.data, prevPageData?.data)) {
    setPageData({ data: JSON.stringify(getPageData()) });
  }
}, [getPageData(), setPageData]);

React.useEffect(() => {}, [getPageData()?.textFieldValue]);

exportPageContext({
  onTextChange: (value) => {
    setPageData({ textFieldValue: value });
  },
  resetAllText: () => {
    setPageData({
      textFieldValue: '',
      gender: null,
      textFieldValue1: '',
      gender1: null,
    });
    resetForm('testForm');
  },
  submit: async () => {
    const isValid = await validateForm('testForm');
    console.log(`isValid testForm ${isValid}`);
  },
});
