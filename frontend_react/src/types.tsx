// ALL MY ROUTES GO HERE AND THEIR EXPECTED PARAMETERS
export type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    Regimens: undefined
  };
  