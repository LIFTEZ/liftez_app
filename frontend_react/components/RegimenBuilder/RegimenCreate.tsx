import { View,Text,ScrollView, TextInput, Pressable, TouchableOpacity,Modal, StyleSheet,Alert, TextInputContentSizeChangeEvent,NativeSyntheticEvent,TargetedEvent, ActivityIndicator} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from "expo-linear-gradient";
import { CreateParams } from "@/src/types"
import { useTheme } from "@/src/ThemeContext"
import { ChangeEvent, useEffect, useState, useRef, useLayoutEffect } from "react"
import log from "@/src/utils/Logger"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {File,Directory,Paths} from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation, RouteProp } from "@react-navigation/native";
import { RegimenBuildParamList,RootStackParamList } from "@/src/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BuilderButton from "../Buttons/BuilderButton";
import EmailRegimen from "../Forms/EmailRegimen";




interface CreateProps{
formData:CreateParams
navigation:NavigationProp<any>
route:RouteProp<RegimenBuildParamList, 'RegimenCreate'>
}

type FullParams = RegimenBuildParamList & RootStackParamList


type RegimenCreateProps =  CreateProps & NativeStackScreenProps<FullParams, 'RegimenCreate'>;


const RegimenCreate = ({formData,navigation, route}: RegimenCreateProps) =>{

    const{themeType} = useTheme()
    const regimenData = formData

    //modal variables
    const[isModalOpen, setIsModalVisible] = useState<boolean>(false)

    //PDF and email variables
    const[RegimenJSON,setRegimenJSON] = useState<string>('')
    const[RegimenHTML,setRegimenHTML] = useState<string>('')

    //email form data variables returned from EmailRegimen component    
    const[userName, setName] = useState<string>('')
    const[recipEmail, setRecipEmail] = useState<string>('')
    const[senderEmail, setSenderEmail] = useState<string>('')
    const[additionalText,setAdditionalText] = useState<string>('')

    //FINISH CREATION BUTTON AND VARIABLES
    const[isFocused,setIsFocused] = useState<boolean>(false)
    const[isProcessing,setIsProcessing] = useState<boolean>(false)
    const[requestStatus, setRequestStatus] = useState<string>('')
    const[isCreationComplete, setIsCreationComplete] = useState<boolean>(false)
    const[regimenCount, setRegimenCount] = useState<number>(0)
    const[storedRegimen,setStoredRegimen] = useState<string>('')


    const[inputHeight, setInputHeight] = useState<number>(0)

    //PROCESS REQUEST FUNCTIONS/COMPLETE CREATION /////////////////////////////////////
    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

    //generate PDF uri
    const generatePDF = async () =>{
        try{
            const { uri } = await Print.printToFileAsync({
                html: `<h1>${RegimenHTML}</h1>`,
                width: 612, // US Letter width in points
                height: 792, // US Letter height in points
                base64: true, // Set to true if you need the base64 string
              });
            console.log('PDF uri generated:', uri);
            return uri
        }
        catch(error){
            console.error('Error generating PDF:', error);
        }
    }


    //THIS IS THE MAIN FUNCTION WHERE I WILL PROCESS ASYNC ADD AND EMAIL SHARE

    const processRequest = async () =>{
       
        return new Promise<boolean>(async resolve =>{
           
            if(userName && recipEmail && senderEmail){
                setIsProcessing(true)
                setRequestStatus('processing email request...')
                log.debug('email configured process request thru api gateway and lambda')
                const didEmail = await EmailRegimenFunc(userName, recipEmail,senderEmail, additionalText)
                if(didEmail){
                    setRequestStatus('email delivered!')
                    setTimeout(async ()=>{
                        const isRegimenStored = await RegimenStorage()
                        if(isRegimenStored)
                            resolve(true)
                    },2000)
                    
                    //store regimen in async storage
                    
                    
                }
                else{
                    setRequestStatus('email failed to send returning to previous screen...')
                    setTimeout(()=>{
                        setIsProcessing(false)
                        resolve(false)
                    },3000)
                    log.debug('email failed to send')
                   
                }
                
            }
            else{
                Alert.alert(
                    "", // Dialog Title
                    "NO EMAIL CONFIG SET. Please fill out Name, Recipient, and Sender fields if you want to share this regimen via email. Press OK to proceed with regimen creation.", // Dialog Message
                    [
                        {
                           text: "OK",
                           onPress: async () =>{
                                setIsProcessing(true)
                                
                                const isRegimenStored = await RegimenStorage()
                                
                                if(isRegimenStored){
                                    resolve(true)
                                }
                            
                            },
                           style:'default'
                        },
                        {
                           text: "CANCEL",
                           onPress: () =>{
                            return
                            },
                           style:'cancel'
                        }
                    ]
                )
            }

            
        })

    }


    //create and store regimen in asyncstorage
    const createRegimen = async()=>{
        const result = await processRequest()
        if(result){
        setIsProcessing(false)
        log.debug('regimen was successfully created')
        setIsCreationComplete(true)
        }
    }

    const RegimenStorage = async ():Promise<boolean> =>{

        //await AsyncStorage.removeItem('Regimen_0')

        setRequestStatus('saving regimen to local storage...')

        const storagekey = `Regimen_${regimenCount}`
        const value = RegimenJSON

        //if I want here in the future I can create an object
        /* 
        interface RegimenObj{
            date:string //creation date, current date
            regimen: string //the actual regimen
            name: string //name of the regimen
        }
        and use this object to add creation date label to the regimenitem
        also the option to rename the regimen or set a name prior, can be implemented once in Testflight or i'll never deploy this app
        */

        const regimenAddedPromise = await new Promise(async res => {
            setTimeout(async ()=>{
                await AsyncStorage.setItem(storagekey, value)
                res(true)
            },5000)
            
        });
        
        const regimenAdded = await regimenAddedPromise
        if(regimenAdded){
            log.debug('regimen successfully added to async storage')

            const regimen = await AsyncStorage.getItem(storagekey)
            if(regimen)
            setStoredRegimen(regimen)
        }
        
        log.debug('creating regimen.....waiting')
        setRequestStatus('finishing up...')
        const isFinalizedPromise = await new Promise(res =>
            setTimeout(()=>{
            log.debug('finalizing creation')
            res(true)
        },5000))

        const isFinalized = await isFinalizedPromise

        if(isFinalized){
            return true
        }
        else{
            return false
        }
    }


    //share regimen as email and pdf document attachment
    const EmailRegimenFunc = async (name:string, emailTo:string, emailFrom:string, addText:string | undefined ): Promise<boolean> =>{

            //MODIFY THE REGIMEN (with or without additional notes), to replace the br with the word break
            let regimenFinal:string = RegimenHTML
            const lines:string[] = regimenFinal.split('<br>')

            let modRegimenFinal:string = ''
            for(const line of lines){
                
                if(line.includes(':')){
                    modRegimenFinal+= '/break//break/' + line
                 }
                 else if(line != ''){
                    modRegimenFinal+= '/break/' + line
                 }
            }
            regimenFinal = modRegimenFinal
            
            //MODIFY THE REGIMEN ADDITIONAL NOTES
            let regimenHTMLmod:string = ''

            if(addText){

                const lines:string[] = addText.split('\n')

                let modAddText:string = ''

                for(const line of lines){
                   
                    //empty line equals page break defined as /doublebreak/ for the replace in rn_api_proxy/index.ts
                    if(line == ''){
                        modAddText += '/doublebreak/'
                    }
                    else{
                        modAddText += line
                    }
                }
                modAddText.trim()
                regimenHTMLmod = regimenFinal + "/line/" + modAddText
                
            }


            //check if regimen was modified with additional notes
            if(regimenHTMLmod){
                regimenFinal = regimenHTMLmod
            }
         
            log.debug('regimen final:', regimenFinal)
            
            const {uri}  = await Print.printToFileAsync({
                html: `<h1>${regimenFinal}</h1>`,
                width: 612, // US Letter width in points
                height: 792, // US Letter height in points
                base64: true, // Set to true if you need the base64 string
            });
            console.log('PDF uri generated:', uri);
          
      
            //read the PDF file
            const file = new File(uri)
            log.debug('file:',file)
            //convert to base64
            const fileContents = file.base64Sync();
            
            // log.debug('file contents:', fileContents)

            interface FileObj{
                fileName:string
                content:object //file type is object
                base64:string
                contentType:string
            }

            interface EmailObj{
                name:string
                recipient:string
                sender:string
            }

            interface PayLoad{
                file: FileObj
                email: EmailObj
            }

            interface ResponseObj{
                error:boolean;
                statusCode:number;
                data?:string;
            }

            const fileObj:FileObj={
                fileName:'regimen.pdf',
                content:file,
                base64:fileContents,
                contentType:file?.type, //type is a property that exists in file
            }

            const emailObj:EmailObj={
                name:name,
                recipient:emailTo,
                sender:emailFrom
            }


            //AFTER EATING ////
            //ADD REST OF PAYLOAD VALUES name, recip email, sender email
            const payload:PayLoad = {
                file:fileObj,
                email:emailObj
            }
            
            //const port = 3000

            const apiUrl = process.env.EXPO_PUBLIC_API_GATEWAY
            try{
                //gotta use device IP when using the fetch call
                const response = await fetch(apiUrl, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(payload)


                })

                if(response.status == 500){
                    throw new Error('failed to send email')
                }
                else{
                    log.debug('successful call')        
                    log.debug('api response:',response)
                    return true
                }
            }
            catch (error){
                console.log('Error connecting to API Gateway, make sure endpoint is correct, resources are deployed and there are no issues with lambda or SES')
                return false
            }
            
            //log.debug(payload)
          
    }


    const downloadPDF = async () =>{
        try {
            const uri:string = await generatePDF() ?? ''
            await Sharing.shareAsync(uri)
        
          } catch (error) {
            console.error('Error sharing PDF:', error);
          };
       
    }

    //EMAIL CONFIG FUNCTIONS ///////////////////////////////////////////////////////
    /** 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
    */


    //EMAILREGIMEN CHILD COMPONENT FUNCTION

    interface childData{
        closeModal:boolean
        senderName?:string
        senderEmail?:string
        recipEmail?:string
        additionalNotes?:string
    }

    //take data from close button function in EmailRegimen component and set the values
    const handleEmailData = async (data: childData) =>{
        //close modal
        setIsModalVisible(!data.closeModal) // value is true so ! is needed for invert/opposite

        //set form values
        if(data.senderEmail)
        setSenderEmail(data.senderEmail)
        if(data.senderName)
        setName(data.senderName)
        if(data.recipEmail)
        setRecipEmail(data.recipEmail)
        if(data.additionalNotes)
        setAdditionalText(data.additionalNotes)

    }

    //ON MOUNT FUNCTIONS //////////////////////////////////////////////
    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

    //convert regimenData into a string
    const createJsonRegimen = () =>{

        //async storage
        let jsonValue:string = ``
        //pdf 
        let htmlValue:string = ``

        //loop through each object using days length
        regimenData.fullSelection.days?.forEach((day, index) =>{
           
            const muscles = regimenData.fullSelection?.muscles?.[index]

            log.debug(`${day},${muscles}`)

            //PDF VERSION
            htmlValue+= `<br> ${day.toUpperCase()}: ${muscles?.toUpperCase().replaceAll('_','/')} <br>`
            //ASYNC STORAGE VERSION (DOESNT USE HTML)
            jsonValue+= `\n ${day.toUpperCase()}: ${muscles?.toUpperCase().replaceAll('_','/')} \n`

            regimenData.fullBuild[index].status.forEach((exerciseStatus, statusIndex)=>{

                if(exerciseStatus == true){
                    const exercise = regimenData.fullBuild[index].exercise[statusIndex]

                    //PDF VERSION
                    htmlValue+=`- ${exercise} <br>`
                    //ASYNC STORAGE VERSION (DOESNT USE HTML)
                    jsonValue+=`- ${exercise} \n`
                }
            })
        })


        log.debug(htmlValue)
        setRegimenHTML(htmlValue)
        setRegimenJSON(jsonValue)

    }

    //set initial regimen count
    const getRegimenCount = async() =>{

        let totalRegimens:number = 0
        
        const keys = await AsyncStorage.getAllKeys()

        keys.forEach((key)=>{

            if(key.includes('Regimen_')){
                log.debug('regimen key:', key)
                totalRegimens+=1
            }
        })

        setRegimenCount(totalRegimens)
        
    }

    const deleteAllRegimens = async() =>{

        const keys = await AsyncStorage.getAllKeys()

        keys.forEach(async (key)=>{

            if(key.includes('Regimen_')){

                await AsyncStorage.removeItem(key)
            }
        })
    }


    useEffect(()=>{

        log.debug('regimen count:', regimenCount)

    },[regimenCount])

    //on mount generate json string and set regimen count based on if any async stored regimens exist
    useEffect(()=>{
        //deleteAllRegimens()
        createJsonRegimen()
        getRegimenCount()
    },[formData])

    useLayoutEffect(()=>{
        setTimeout(()=>{
        if(isProcessing || isCreationComplete){
            //remove the back button
            log.debug('remove back button and bottom tabbar once done')
            navigation?.getParent()?.setOptions({
                headerLeft:null,
                headerBackVisible:false,
                headerTitle:'',
                
            })
            //remove bottom tabbar navigation
            navigation.getParent()?.getParent()?.setOptions({
                tabBarStyle: { display: 'none' }
            })
        }
        else{
            navigation?.getParent()?.setOptions({
                headerBackVisible:true,
                headerTitle:''
            })
        }
    },300)
    },[isProcessing, isCreationComplete])


    return(
        <View>
        

        

        {/* IF PROCESSING REQUEST DISPLAY SPINNER WITH TEXT SAYING WHAT IS HAPPENING */}
        {isCreationComplete?
            storedRegimen?
                <View>
                <Text className="text-center mt-4" style={{color:'#00bc7d'}}>REGIMEN SUCCESSFULLY CREATED!</Text>
                <ScrollView className="h-[70%] border-2 p-4 mt-2 rounded-lg border-emerald-500">
                <Text  style={{color:themeType.textPrimary}}>{storedRegimen}</Text>
                </ScrollView>
                <View className="mt-10">
                <BuilderButton title="FINISH" navigation={navigation} childRoute="RegimenMain"/>
                </View>
                </View>
            :null
        
        :
          isProcessing?
                <View className="h-[80%] flex flex-col justify-center items-center">
                <ActivityIndicator size='large' color='lime'/>
                <Text className="mt-4" style={{color:themeType.textPrimary}}>{requestStatus}</Text>
            
            
                </View>
            :
            <View>
                <View className='p-2 border-2 rounded-lg border-emerald-500 mt-4' style={{backgroundColor:themeType.screenBg,height:300}}>
                <View className='p-4 rounded-xl h-full ' style={{backgroundColor:themeType.headerBg}}>
                
                <Text className="text-center text-emerald-500 -mt-2 p-2 " style={{borderBottomWidth:2, borderBottomColor:'lime'}}>YOUR BUILT REGIMEN</Text>
                
                <ScrollView className='' style={{height:300}}>
                    {regimenData.fullSelection?.days?.map((day, index) => (
                        <View key={index}>
                            <View className='mt-4 flex flex-row justify-between'>
                            <View className="flex flex-row">
                            <Text style={{color:themeType.textPrimary}}>{day.toUpperCase()}: </Text>
                            <Text style={{color:themeType.textPrimary, maxWidth:120}}>{regimenData.fullSelection?.muscles?.[index].replaceAll('_','/').toUpperCase()}</Text>
                            </View>
                            <View>
                            <Text style={{color:themeType.textPrimary}}>Total Exercises:{regimenData.totalExercises[index]}</Text>
                            </View>
                        
                            </View>
                            <View >

                                {regimenData.fullBuild[index].status.map((exerciseStatus, statusIndex)=>(
                                    <View key={statusIndex}>
                                        {exerciseStatus == true?
                                        <Text style={{color:'#00bc7d'}}>- {regimenData.fullBuild[index].exercise[statusIndex]}</Text>
                                        :null}
                                    
                                    </View>
                                ))}
                            
                            </View>
                        </View>
                    ))}
                    </ScrollView>
                </View>
                </View>

                {/* EMAIL COMPONENT */}
                <EmailRegimen isModalOpen={isModalOpen} onDataReceived={handleEmailData}/>

            {/* ADDITIONAL OPTIONS */}
            <View>
                {/* EMAIL OPTION */}
                <View className="p-2 mt-6">
                <TouchableOpacity onPress={()=>setIsModalVisible(true)}>
                <Text style={{color:'#00bc7d'}}>PRESS TO CONFIG EMAIL OPTION</Text>
                <MaterialIcons name="attach-email" size={24} color={themeType.textPrimary} />
                </TouchableOpacity>
                </View>
                {/* PDF generate */}
                <View className="p-2 mt-2">
                <TouchableOpacity onPress={()=>downloadPDF()}>
                <Text style={{color:'#00bc7d'}}>PRESS TO DOWNLOAD PDF FILE</Text>
                <FontAwesome6 name="file-pdf" size={24} color={themeType.textPrimary} />
                </TouchableOpacity>
                </View>
            </View>
                <View className='h-[20%] flex justify-end mt-2'>
                <LinearGradient
                    colors={isFocused?['#23f707','#5fc752','#00bc7d']:['#919191', '#737373', '#bfbfbf']}
                    // style={{borderWidth:2, padding:15, borderRadius:10, borderColor:}}
                    style={styles.gradientWrapper}
                    >
                        <View style={styles.innerContent}>
                            {/* inner gradient */}
                            <LinearGradient
                                colors={['#4d4d4d','#363535','#232323']}
                                style={styles.gradientWrapper}
                                >       
                            {/* Navigate to RegimenBuildMain which contains the routes RegimenStart, RegimenDays, RegimenSplit, RegimenCreate */}
                            <Pressable onPressIn={()=> setIsFocused(true)} onPressOut={()=> {[setIsFocused(false), createRegimen()]}}>
                                <Text style={{color:isFocused? 'lime':themeType.textPrimary2,fontFamily:'ScienceGothic-Regular'}} className='text-center text-xl p-2 uppercase'>CREATE REGIMEN</Text>
                            </Pressable>
                            {/* <Text style={{color:themeType.textPrimary}} className='mt-10' onPress={()=> navigation.navigate('RegimenBuildMain')}> Go to Regimen Builder</Text> */}
                            </LinearGradient>
                        </View>
                    </LinearGradient>
                </View>
            </View>
            }
    </View>
    )


}


export default RegimenCreate

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(255,255,255,.5)'
      },
      modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'left',
      },
      modalText: {
        marginBottom: 15,
        marginLeft:10,
      },
      gradientWrapper: {
        padding: 1, // This defines the border thickness
        borderRadius: 12, // Apply border radius to the gradient
        overflow: 'hidden', // Essential for radius to work correctly
        
      },
      innerContent: {
        
        backgroundColor: '', // Inner background color (make transparent to show gradient)
        borderRadius: 8, // Slightly less than wrapper radius
        padding: 4,
        shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius:2,
      },
})