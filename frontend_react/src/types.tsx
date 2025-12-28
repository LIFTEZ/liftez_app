// ALL MY ROUTES GO HERE AND THEIR EXPECTED PARAMETERS
export type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};
  


// EXPECTED Form data parameters, create a new interface for each route because each route requires different data passed
interface FormData{
    days?:string
}

interface FormData2{
    Step1:FormData
    Username:string
}

interface FormData3{
    Step1:FormData
    Step2:FormData2
    email: string
}

export type RegimenBuildParamList = {
RegimenStart:undefined //inital menu that explains how the builder works
RegimenDays: { formData?: Partial<FormData> };  //select the day split and muscle groups and pass them to the next screen
RegimenSplit: { formData2?: Partial<FormData2> }; //actually build the split based on the day and muscle groups provided 
RegimenCreate: { formData3?: Partial<FormData3> }; //create the regimen and store in async, email to someone or self, generate pdf, etc
};