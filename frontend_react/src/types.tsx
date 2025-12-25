// ALL MY ROUTES GO HERE AND THEIR EXPECTED PARAMETERS
export type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuild: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
  };
  