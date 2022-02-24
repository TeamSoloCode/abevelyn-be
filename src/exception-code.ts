const ExceptionCode = {
  USER_PROFILE: {
    NOT_FOUND: {
      code: 'PROFILE_NOT_FOUND',
      message: 'Profile is not found',
    },
    NEED_PROFILE_TO_PROCESS: {
      code: 'NEED_PROFILE_TO_PROCESS',
      message: 'Please update your profile before continue',
    },
    MISSING_INFO_TO_ORDER: {
      code: 'MISSING_INFO_TO_ORDER',
      message:
        'Please add Name, Address, Phone Number of your profile to order',
    },
  },
  CART_ITEM: {
    NO_ITEM_SELECTED: {
      code: 'NO_ITEM_SELECTED',
      message: 'Please select at least 1 item to order',
    },
  },
};

export default ExceptionCode;
