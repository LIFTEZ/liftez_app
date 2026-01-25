import { View,Text,Modal, Pressable, TextInput, Alert, StyleSheet, TextInputContentSizeChangeEvent, NativeSyntheticEvent, TargetedEvent, ActivityIndicator} from "react-native"
import { useState,useEffect,useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from "@/src/ThemeContext";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {File,Directory,Paths} from 'expo-file-system';
import log from "@/src/utils/Logger"


interface childData{
    closeModal:boolean
    senderName?:string
    senderEmail?:string
    recipEmail?:string
    additionalNotes?:string
}



interface EmailProps{
    isModalOpen?:boolean //used for individual regimenitem in flatlist but also can just be used to apply modal visibility state without flatlist
    route?:string //optional: this will determine whether a different submission component exists within this component, regimenitem component requires the form to handle the submission unlike RegimenCreate
    regimen?:string //optional: this is only required for flatlist since submission for a regimenitem render item will be done from this form and not the Regimen Builder RegimenCreate step
    onDataReceived?:(data: childData) => void //optional: only required for flatlist component because
}


const EmailRegimen = ({isModalOpen, regimen, route, onDataReceived}: EmailProps) => {
    const{themeType} = useTheme()
   //modal variables
   const[isVisible, setIsVisible] = useState<boolean>(false)
   const[isBtnFocused, setIsBtnFocused] = useState<boolean>(false)
   const[isSendBtnFocused,setIsSendBtnFocused] = useState<boolean>(false)

   //PDF and email variables
   const[RegimenHTML,setRegimenHTML] = useState<string>('')
   const scrollRef = useRef<KeyboardAwareScrollView>(null);
   const multilineRef = useRef<TextInput>(null);
   const[additionalText,setAdditionalText] = useState<string>('')

   //USER NAME VARIABLES
   const[userName, setName] = useState<string>('')
   const[cancelName, setCancelName] = useState<boolean>(false)
   const[inputName, setText] = useState<string>('')
  
   //RECIPIENT EMAIL VARIABLES
   const[recipEmail, setRecipEmail] = useState<string>('')
   const[cancelRecipEmail,setCancelRecipEmail] = useState<boolean>(false)
   const[inputRecip, setRecipText] = useState<string>('')

   //SENDER EMAIL VARIABLES
   const[senderEmail, setSenderEmail] = useState<string>('')
   const[cancelSenderEmail,setCancelSenderEmail] = useState<boolean>(false)
   const[inputSender, setSenderText] = useState<string>('')

   //EMAIL PROCESSING VARIABLES
   const[processingText, setProcessingText] = useState<string>('')
   const[isProcessing, setIsProcessing] = useState<boolean>(false)
   const[isFormReady, setIsFormReady] = useState<boolean>(false)

//convert string regimen to HTML format for email
  const regimenToHTML = async (regimen:string) =>{

        log.debug('need to convert this regimen:',regimen)

        const regimenSplit = regimen.split('\n')

        let regimenHTML:string = ''

        regimenSplit.forEach((line) =>{
            log.debug(line)
            if(line == ''){
                regimenHTML += '<br>'
            }
            if(line.includes(':')){
                line.replaceAll('_','/')
                regimenHTML += line + '<br>'
            }

            if(line.includes('-')){
                regimenHTML += line + '<br>'
            }
        })
        
        setRegimenHTML(regimenHTML)
    }

//share regimen as email and pdf document attachment
const EmailRegimen = async (name:string, emailTo:string, emailFrom:string, addText:string | undefined ): Promise<boolean> =>{
  
    setIsProcessing(true)
    setProcessingText('sending email...')
  
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
    log.debug('PDF uri generated:', uri);
  

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
    log.debug('api url:',apiUrl)
    try{
        //gotta use device IP when using the fetch call
        const response = await fetch(apiUrl, {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(payload)


        })


                
        //failed lambda response
        if(response.status == 500){
            setIsSendBtnFocused(false)
            setIsProcessing(false)
            throw new Error('failed to send email')
        }
        else{
            log.debug('successful call')        
            log.debug('api response:',response)
            setProcessingText('email successfully delivered!')
            setTimeout(()=>{
                setIsProcessing(false)
                setName('')
                setRecipEmail('')
                setSenderEmail('')
                setAdditionalText('')
                setIsSendBtnFocused(false)
            },2000)
          
            return true
        }
       
        

    }
    catch (error){
        log.warn('Error connecting to API Gateway, make sure endpoint is correct, resources are deployed and there are no issues with lambda or SES')
        setProcessingText('failed to send email...exiting process')
        setTimeout(()=>{
        setIsProcessing(false)
        setProcessingText('')
        },2000)
        throw new Error('failed to send email')
    }
    
   
  
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

    const handleName = () =>{

        if(inputName == ''){
            setName('')
            setText('')
            return
        }

        setName(inputName)
        setText('')
    }

    const handleRecipEmail = () =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        
        if(inputRecip == ''){
            setRecipEmail('')
            setRecipText('')
            return
        }
        
        if(!emailRegex.test(inputRecip)){
            alert('invalid email')
            setRecipEmail('')
            setRecipText('')
            return
        }
       

        setRecipEmail(inputRecip)
        setRecipText('')
    
    }
    const handleSenderEmail = () =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        
        if(inputSender == ''){
            setSenderEmail('')
            setSenderText('')
            return
        }
        
        if(!emailRegex.test(inputSender)){
            alert('invalid email')
            setSenderEmail('')
            setSenderText('')
            return
        }
       

        setSenderEmail(inputSender)
        setSenderText('')
    
    }

    const handleContentSizeChange = (event:TextInputContentSizeChangeEvent) =>{

        // log.debug(event.nativeEvent.contentSize.height)
        multilineRef.current?.measure((
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number   
        ) => {scrollRef.current?.scrollToPosition(x,y,true)}
        )
    }

    const handleFocusScroll = (event: NativeSyntheticEvent<TargetedEvent>) => {

        multilineRef.current?.measure((
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number   
        ) => {scrollRef.current?.scrollToPosition(x,y,true)}
        )
      
    }

    useEffect(() =>{

            if(userName && senderEmail && recipEmail){
                setIsFormReady(true)
            }
            else{
                setIsFormReady(false)
            }

    },[userName, senderEmail, recipEmail])

    useEffect(()=>{

        if(regimen)
        regimenToHTML(regimen)
        
    },[regimen])


    return(

        <View>
                {/* EMAIL COMPONENT */}
                <Modal 
                animationType="fade"
                visible={isModalOpen} //route determines whether this component exists in regimenmain or CreateRegimen
                transparent={true}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                
                }}>
                    
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView,{backgroundColor:themeType.modal}]} className='w-[95%] h-[85%]  '>
                            <View className='h-full w-full p-2 rounded-lg' style={{backgroundColor:themeType.screenBg, borderColor:'lime', borderWidth:1}}>
                                <KeyboardAwareScrollView
                                ref={scrollRef}
                                enableAutomaticScroll={true}
                                extraScrollHeight={30}
                                >
                                
                                <Text className="mt-4 p-2" style={{color:'#00bc7d', fontWeight:'bold'}}>EMAIL: (optional) <Text style={{fontSize:12}}>*Email this regimen to you or someone else upon creation*</Text></Text>
                                <Text className="mt-4 p-2" style={{color:'#00bc7d', fontSize:12}}>**Regimen will be sent in text format and will also be attached as a pdf file without the file having to be created**</Text>
                                    {/* USER NAME FIELD */}
                                    <Text className="mt-4 p-2" style={{color:'#00bc7d', fontWeight:'bold'}}>Name:</Text>
                                    <TextInput placeholder="enter your name" className="p-2 border-2 rounded-lg" keyboardType="email-address" inputMode='email'
                                    onChangeText={newText => setText(newText)} onBlur={()=>handleName()} value={inputName} style={{backgroundColor:themeType.textPrimary2}}/>
                                    {userName?
                                    <View className="flex flex-row items-center">
                                    <Text className="p-2" style={{color:'#00bc7d'}}>Name: {userName}</Text>
                                    <Pressable  className='items-center' onPressIn={()=>{setCancelName(true)}} onPressOut={()=>{setCancelName(false), setName(''), setText('')}}>
                                    <MaterialIcons style={{marginRight:10}} name="cancel" size={20} color={cancelRecipEmail?'lime': themeType.textPrimary} />
                                    </Pressable>
                                    </View>
                                    :null}
                                    {/* RECIPIENT FIELD */}
                                    <Text className="mt-4 p-2" style={{color:'#00bc7d', fontWeight:'bold'}}>Recipient:</Text>
                                    <TextInput placeholder="enter recipient email" className="p-2 border-2 rounded-lg" keyboardType="email-address" inputMode='email'
                                    onChangeText={newText => setRecipText(newText)} onBlur={()=>handleRecipEmail()} value={inputRecip} style={{backgroundColor:themeType.textPrimary2}}/>
                                    {recipEmail?
                                    <View className="flex flex-row items-center">
                                    <Text className="p-2" style={{color:'#00bc7d'}}>Email: {recipEmail}</Text>
                                    <Pressable  className='items-center' onPressIn={()=>{setCancelRecipEmail(true)}} onPressOut={()=>{setCancelRecipEmail(false), setRecipEmail(''), setRecipText('')}}>
                                    <MaterialIcons style={{marginRight:10}} name="cancel" size={20} color={cancelRecipEmail?'lime': themeType.textPrimary} />
                                    </Pressable>
                                    </View>
                                    :null}
                                    {/* SENDER FIELD */}
                                    <Text className="mt-4 p-2" style={{color:'#00bc7d', fontWeight:'bold'}}>Sender:</Text>
                                    <TextInput placeholder="enter your/sender email" className="p-2 border-2 rounded-lg" keyboardType="email-address" inputMode='email'
                                    onChangeText={newText => setSenderText(newText)} onBlur={()=>handleSenderEmail()} value={inputSender} style={{backgroundColor:themeType.textPrimary2}}/>
                                    {senderEmail?
                                    <View className="flex flex-row items-center">
                                    <Text className="p-2" style={{color:'#00bc7d'}}>Email: {senderEmail}</Text>
                                    <Pressable  className='items-center' onPressIn={()=>{setCancelSenderEmail(true)}} onPressOut={()=>{setCancelSenderEmail(false), setSenderEmail(''), setSenderText('')}}>
                                    <MaterialIcons style={{marginRight:10}} name="cancel" size={20} color={cancelSenderEmail?'lime': themeType.textPrimary} />
                                    </Pressable>
                                    </View>
                                    :null}
                                    {/* ADD ADDITIONAL NOTES FIELD MULTILINE TEXTINPUT */}
                                    <Text className="mt-4 p-2" style={{color:'#00bc7d', fontWeight:'bold'}}>Additional Notes (optional):</Text>
                                    <Text className="p-2" style={{color:'#00bc7d', fontSize:12}}>This will be appended to the bottom of the regimen**</Text>
                                    <TextInput 
                                    className="p-2  border-2 rounded-lg" 
                                    ref={multilineRef}
                                    multiline={true} 
                                    value={additionalText}
                                    onFocus={handleFocusScroll}
                                    onChangeText={newText=>setAdditionalText(newText)}
                                    onContentSizeChange={handleContentSizeChange}
                                    style={{backgroundColor:themeType.textPrimary2}} />
                             


                            </KeyboardAwareScrollView>
                            </View>

                               {/* ONLY EXISTS ON REGIMENMAIN */}
                               {route?
                               <View className="flex flex-row" style={{justifyContent:isFormReady?'space-between':'center', width:isFormReady?'100%':'auto'}}>
                                    {isProcessing?
                                        <View className="w-full flex flex-col justify-center items-center rounded-b-lg p-2" style={{backgroundColor:themeType.headerBg}}>
                                            <ActivityIndicator size='large' color='lime' className="mt-2"/>
                                            <Text className="mt-2 text-emerald-500">{processingText}</Text>
                                        </View>
                                    :
                                    (<>
                                        <Pressable className='mt-2 bg-emerald-500'
                                        style={[styles.button, {transform:isBtnFocused?[{ scale: 1.2 }]: [{scale:1}]}]}
                                        onPress={() => onDataReceived?(onDataReceived({closeModal:true, senderName:userName, senderEmail:senderEmail, recipEmail:recipEmail, additionalNotes:additionalText })):undefined} onPressIn={()=> setIsBtnFocused(true)} onPressOut={()=> setIsBtnFocused(false)}>
                                        <Text style={styles.textStyle}>Close</Text>
                                            </Pressable>   
                                        {isFormReady?
                                            <Pressable className='mt-2 bg-emerald-500'
                                            style={[styles.button, {transform:isSendBtnFocused?[{ scale: 1.2 }]: [{scale:1}]}]}
                                            onPress={() => EmailRegimen(userName, recipEmail, senderEmail, additionalText)} onPressIn={()=> setIsSendBtnFocused(true)} onPressOut={()=> setIsSendBtnFocused(false)}>
                                            <Text style={styles.textStyle}>Send</Text>
                                                </Pressable>    
                                        :null} 
                                    </>)
                                    }   
                                </View>
                                   
                                :<Pressable className='mt-2 bg-emerald-500'
                                style={[styles.button, {transform:isBtnFocused?[{ scale: 1.2 }]: [{scale:1}]}]}
                                onPress={() => onDataReceived?(onDataReceived({closeModal:true, senderName:userName, senderEmail:senderEmail, recipEmail:recipEmail, additionalNotes:additionalText })):undefined} onPressIn={()=> setIsBtnFocused(true)} onPressOut={()=> setIsBtnFocused(false)}>
                                <Text style={styles.textStyle}>Close</Text>
                            </Pressable>}
                             
                        <View className='-mt-4'>
                        
                        </View>
                        </View>
                    </View>
                
                </Modal>

        </View>

    )

}



export default EmailRegimen


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