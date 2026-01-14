// ALL MY ROUTES GO HERE AND THEIR EXPECTED PARAMETERS
export type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};
  
interface ExerciseObj{
    id:number
    status:boolean[] 
    exercise: string[]
   
}

interface SelectParams{
    days:string[] | undefined
    muscles:string[] | undefined
}

export interface CreateParams{
    fullBuild:ExerciseObj[]
    fullSelection:SelectParams
    totalExercises:number[]
}

// EXPECTED Form data parameters, create a new interface for each route because each route requires different data passed
interface FormData{
    days:string[]
    muscles:string[]
    prevRoute?:string
    prevRouteParams?:CreateParams
}

interface FormData2{
    Step2:FormData
    email: string
}


export type RegimenBuildParamList = {
RegimenStart:undefined //inital menu that explains how the builder works
RegimenSelect: undefined  //select the day split and muscle groups and pass them to the next screen
RegimenBuild: { formData: Partial<FormData> }; //actually build the split based on the day and muscle groups provided 
RegimenCreate: { formData?: Partial<FormData> }; //create the regimen and store in async, email to someone or self, generate pdf, etc
};