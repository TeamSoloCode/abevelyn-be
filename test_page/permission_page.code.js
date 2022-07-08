exportPageContext({
  askForLocationPermission: async () => {
    const status = await requestPermission('location');
    if (status?.isPermanentlyDenied) {
      openAppSettings();
    }
    console.log(JSON.stringify(status));
  },
  checkLocationPermissionStatus: async () => {
    const status = await getPermissionStatus('location');
    console.log(JSON.stringify(status));
  },
});
