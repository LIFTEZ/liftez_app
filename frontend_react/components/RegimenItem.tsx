import { useEffect, useState,useRef  } from 'react';
import {View,Text, TouchableOpacity, Animated, ScrollView, Modal, Alert, StyleSheet, Pressable, NativeSyntheticEvent, TextInputContentSizeChangeEvent, TargetedEvent} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Gesture, GestureDetector, TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from '@/src/utils/Logger';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {File,Directory,Paths} from 'expo-file-system';
import { useTheme } from '@/src/ThemeContext';
import EmailRegimen from './Forms/EmailRegimen';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons.js'
import Feather from '@expo/vector-icons/Feather.js'
import {LinearGradient} from 'expo-linear-gradient'


interface deleteResponse{
    status:boolean
}

interface Data{

    regimenkey:string
    didDelete?:(data: deleteResponse) => void //return function to parent (RegimenMain) to let it know regimen was deleted
}

const RegimenItem = ({regimenkey, didDelete}:Data) =>{
    const count = parseInt(regimenkey.split('_')[1]) + 1
    const text = regimenkey.split('_')[0]

    const regimenLabel = text + ' ' + count.toString()

    const[Regimen, setRegimen] = useState<string>('')

   


    const{themeType} = useTheme()
    
    //ANIMATION FUNCTIONS AND VARIABLES ///////////////////////////////////////

    const springX = useRef(new Animated.Value(50)).current;
    const springOpacity = useRef(new Animated.Value(0)).current;
    const [displayOption,setDisplayOption] = useState<boolean>(false) //also will check if item has been swiped

    const showDelete = async() => {
        setDisplayOption(true)
        Animated.spring(springX, {
            toValue: 7, // Final value
            friction: 3, // Controls bounciness (default 7)
            tension: 40, // Controls speed (default 40)
            useNativeDriver: true, // Use the native driver for performance
          }).start()
        Animated.timing(springOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start((animationComplete)=>{
            if(animationComplete){
                //display regimen options
               
            log.debug('animation complete')
            }
           
        });
        


    }
    const hideDelete = async() => {
     
        Animated.timing(springOpacity, {
            toValue: 0,
            duration: 25,
            useNativeDriver: true,
        }).start((animationComplete)=>{
            if(animationComplete){
                //hide regimen options
                setDisplayOption(false)
            log.debug('animation complete')
            }
        });
        Animated.spring(springX, {
            toValue:50, // Final value
            friction: 3, // Controls bounciness (default 7)
            tension: 40, // Controls speed (default 40)
            useNativeDriver: true, // Use the native driver for performance
          }).start()
       

    }
   
 

    //DELETE BUTTON
    const animatedStyle = {
        transform: [
          { translateX: springX },
        ],
        opacity:springOpacity
      };


    let sensitivity:number = 25
    const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((e) =>{    
        log.debug('pan gestured started')
    })
    .onUpdate((e) =>{
        log.debug('panning translation x:', e.translationX, 'panning translation y:', e.translationY)
        
        
    })
    .onEnd((e)=>{
        log.debug('pan gesture ended')
        //prevent any long up and down swipes from affecting the logic
        if(e.translationY > -40 && e.translationY < 40){
            if(e.translationX < (sensitivity *= -1) && !displayOption){
                showDelete()
            }
            if(e.translationX > sensitivity && displayOption){
                hideDelete()
            }  
        }
    })
    

   //END ANIMATION FUNCTIONS AND VARIABLES ////////////////////////////////////////////

  // const[isFocused,setIsFocused] = useState<boolean>(false)
    //generate PDF uri

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
                regimenHTML += line + '<br>'
            }

            if(line.includes('-')){
                regimenHTML += line + '<br>'
            }
        })
        
        log.debug(regimenHTML)
        return regimenHTML
    }
    //get regimen from asyncstorage and save to useState variable
    const getRegimen = async(key:string) =>{
        const jsonvalue = await AsyncStorage.getItem(key)
        if(jsonvalue){
        setRegimen(jsonvalue)
        }
    }

    //get the regimen from asyncstorage
    useEffect(()=>{
        getRegimen(regimenkey)
        regimenToHTML(Regimen)
    },[regimenkey])

    const generatePDF = async (regimenHTML:string) =>{
        try{
            const { uri } = await Print.printToFileAsync({
                html: `<h1>${regimenHTML}</h1>`,
                width: 612, // US Letter width in points
                height: 792, // US Letter height in points
                base64: true, // Set to true if you need the base64 string
            });
            log.debug('PDF uri generated:', uri);
            return uri
        }
        catch(error){
            console.error('Error generating PDF:', error);
        }
    }
    const downloadPDF = async (regimen:string) =>{
        try {
            const regimenHTML = await regimenToHTML(regimen)
            if(regimenHTML){
            const uri:string = await generatePDF(regimenHTML) ?? ''
            await Sharing.shareAsync(uri)
            }
        
        } catch (error) {
            console.error('Error sharing PDF:', error);
        };
    
    }

    //EMAIL VARIABLES/FUNCTIONS NON COMPONENT ////////////////////////////
    const[isModalVisible, setIsModalVisible] = useState<boolean>(false)
    

    interface childData{
        closeModal:boolean
    
    }
    //callback function from child after close button is pressed 
    const handleModal = (data: childData) =>{
        //close the modal, the value received from the child is true but set to false using !
        setIsModalVisible(!data.closeModal)
    }



    //EDIT BUTTON MODAL VARIABLES/FUNCTIONS /////////////////////////////////////////////
    const[isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false)
    const[isEditBtnFocused, setIsEditBtnFocused] = useState<boolean>(false)
    const[isBtnFocused, setIsBtnFocused] = useState<boolean>(false)
    const[isEditing, setIsEditing] = useState<boolean>(false)
    const[inputValue, setText] = useState<string>('')
    const[input,setInput] = useState<string>('')
    const scrollRef = useRef<KeyboardAwareScrollView>(null);
    const multilineRef = useRef<TextInput>(null)

    const handleContentSizeChange = (event:TextInputContentSizeChangeEvent) =>{

        log.debug(event.nativeEvent.contentSize.height)
        multilineRef.current?.measure((
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number   
        ) => {
            scrollRef.current?.scrollToPosition(x,height,true)} //position y is height in this case, y logs as 0, height is the changing y
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
        ) => {
            scrollRef.current?.scrollToPosition(x,height,true)}//position y is height in this case, y logs as 0, height is the changing y
        )
      
    }

    

    useEffect(()=>{
        log.debug('new input without regimen text:', input)
    },[input])

    const setTextData = async(newText: string) =>{

        //get the input without previous regimen text input
        const char = newText[inputValue.length]
        log.debug(char)
        //account for backspace
        if(char == undefined){
            setInput(input.slice(0, -1))
        }
        else{
            setInput(input + char)
        }
        
        
        setText(newText)

        //log.debug(inputValue)
    }
    const cancelEdit = async() =>{

        const value = await AsyncStorage.getItem(regimenkey)
        
        //if the inputed value does not include any character and is just whitespace, early return
        //check if input does not contain alphanumeric characters or any character
        //DOESNJT WORK AS EXPECTED YET
        // if(input.trim() == ''){
        //     setIsEditing(false)
        //     return
        // }

        //early return if text has been modified by comparing to what exists in asyncstorage
        if(inputValue == value){
            setIsEditing(false)
            return
        }

        Alert.alert(
            'Discard changes?',
             'You have unsaved changes. Are you sure to discard them and exit editing?',
            [
                {
                  text: 'YES',
                  onPress: () => {
                    if(value)
                    setText(value)
                    setInput('')
                    setIsEditing(false)
                  },
                  style: 'destructive',
                },
                {
                  text: 'NO', 
                  onPress: () => {
                    return
                  }
                  
                },
            ]
        )
    }

    const confirmEdit = async() =>{
        const value = await AsyncStorage.getItem(regimenkey)
        //if the inputed value does not include any character and is just whitespace, early return, no confirm needed
         //DOESN'T WORK AS EXPECTED YET
        // if(input.trim() == ''){
        //     setIsEditing(false)
        //     return
        // }
        //dont need to confirm changes if text hasnt been modified by comparing to what exists in asyncstorage
        if(inputValue == value){
            setIsEditing(false)
            return
        }
        Alert.alert(
            'Apply changes?',
            'Are your sure you would like to apply these changes?',
            [
                {
                  text: 'NO',
                  onPress: () => {
                    return
                  },
                  style: 'destructive',
                },
                {
                  text: 'YES', 
                  onPress: async() => {
                    await AsyncStorage.setItem(regimenkey, inputValue)
                    setInput('')
                    setIsEditing(false)
                  }
                  
                },
            ]
        )
    }

    const deleteRegimen = async (key:string) =>{

        Alert.alert(
            'DELETE?',
            'Are your sure you would like delete this regimen? this action CANNOT be undone!',
            [
                {
                  text: 'DELETE',
                  onPress: async () => {
                    await AsyncStorage.removeItem(key)
                    setRegimen('')
                    //let parent component know regimen was deleted to live update
                    didDelete!({status:true})
                    return
                  },
                  style: 'destructive',
                },
                {
                  text: 'CANCEL', 
                  onPress: () => {
                    return
                  }
                  
                },
            ]
        )
    }



    useEffect(()=>{
        setText(Regimen)
    },[Regimen])

    return(
        <View>
        <View  className='rounded-lg mt-2'>
        <LinearGradient
                style={styles.gradientWrapper}
                colors={['#00bc7d', '#737373', '#00bc7d']}
                > 
               <GestureDetector gesture={panGesture}>
               <View className='rounded-xl' style={styles.innerContent}>
                <LinearGradient
                style={[styles.gradientWrapper,{borderWidth:1}]}
                colors={['#919191', '#737373', '#bfbfbf']}
                >

               
                   <View className='flex flex-row justify-between items-center'>
                   <Text style={{fontSize:16, color:themeType.textPrimary2, fontWeight:'500'}} className='p-2'>{regimenLabel}</Text>
                   <Animated.View style={[animatedStyle]}>
                    <Pressable onPress={()=>deleteRegimen(regimenkey)}>
                        <View className='bg-red-500 p-2 pr-4 -mt-2 pb-4 rounded-l-lg'>
                        <Text className='mt-2'>DELETE</Text>
                        </View>
                   </Pressable>
                   </Animated.View>
                   </View>
                   {/* optional creation date later maybe */}
                   {/* <Text className='mb-2' style={{color:themeType.textPrimary2}}>Created On: (creation date)</Text> */}
                   <Animated.View>
                       <View className='flex w-full flex-row justify-end items-center rounded-b-lg   border-2' style={{borderColor:'lime', backgroundColor:themeType.componentBg, display:displayOption?'flex':'none'}}>
                           <TouchableOpacity onPress={()=> downloadPDF(Regimen)}>
                           <FontAwesome6 name="file-pdf" size={24} color={themeType.textPrimary} className='p-2'/>
                           </TouchableOpacity>
                           <TouchableOpacity onPress={()=> setIsModalVisible(true)}>
                           <MaterialIcons name="attach-email" size={24} color={themeType.textPrimary} className='p-2 mt-1' />
                           </TouchableOpacity>
                           <EmailRegimen regimen={Regimen} route={'regimenmain'} isModalOpen={isModalVisible} onDataReceived={handleModal}/>
                           <TouchableOpacity onPress={()=>setIsEditModalVisible(true)}>
                           <FontAwesome6 name="edit" size={24} color={themeType.textPrimary}className='p-2' />
                           </TouchableOpacity>
                       </View>
                   </Animated.View>
                   </LinearGradient>
               </View>
               </GestureDetector>
           
            </LinearGradient>
           </View>


          
           <Modal 
           animationType="fade"
           visible={isEditModalVisible} //route determines whether this component exists in regimenmain or CreateRegimen
           transparent={true}
           onRequestClose={() => {
               Alert.alert('Modal has been closed.');
           
           }}>
               
               <View style={styles.centeredView}>
                   <View style={[styles.modalView,{backgroundColor:themeType.modal}]} className='w-[95%] h-[85%]'>

                       <View className='h-full w-full rounded-lg' style={{backgroundColor:themeType.screenBg, borderColor:'lime', borderWidth:1}}>
                           <View className='rounded-t-lg flex flex-row items-center justify-between' style={{backgroundColor:themeType.headerBg}}>
                           <Text className='text-emerald-500 p-4' style={{fontSize:20}}>{regimenLabel}</Text>
                           {isEditing?
                           <View className='flex flex-row justify-between items-center p-4'>
                           <Pressable className='  ml-2'
                               style={[styles.button, ]}
                               onPress={() => cancelEdit()}>
                               <Feather name='x' size={24} color='red'/>
                           </Pressable>
                               <Pressable className='  ml-2'
                               style={[styles.button, ]}
                               onPress={() => confirmEdit()} >
                               <MaterialIcons name='check' size={24} color='lime'/>
                           </Pressable>
                         </View>
                           :
                           <View className='flex flex-row p-4 '>
                           <Pressable className='flex flex-row items-center'
                               style={[styles.button, {transform:isEditBtnFocused?[{ scale: 1.2 }]: [{scale:1}]}]}
                               onPress={() => setIsEditing(true)} onPressIn={()=> setIsEditBtnFocused(true)} onPressOut={()=> setIsEditBtnFocused(false)}>
                                   {/* <Text className='p-2 text-emerald-500'>EDIT</Text> */}
                               <MaterialIcons name='edit' size={24} color='#00bc7d'/>
                           </Pressable>
                           </View>}
                           </View>
                           <KeyboardAwareScrollView
                           ref={scrollRef}
                           enableAutomaticScroll={true}
                           className='p-4'
                           >

                               <TextInput
                               ref={multilineRef}
                               selectionColor={'#52eb34'}
                               style={{color:themeType.textPrimary}}
                               editable={isEditing?true:false}
                               multiline={true}
                               value={inputValue}
                               onFocus={handleFocusScroll}
                               onChangeText={setTextData}                                
                               onContentSizeChange={handleContentSizeChange}
                               />



                           
                           </KeyboardAwareScrollView>

                       </View>
                       {isEditing?null:
                       <Pressable className='mt-2 bg-emerald-500'
                           style={[styles.button, {transform:isBtnFocused?[{ scale: 1.2 }]: [{scale:1}]}]}
                           onPress={() => setIsEditModalVisible(false)} onPressIn={()=> setIsBtnFocused(true)} onPressOut={()=> setIsBtnFocused(false)}>
                           <Text style={styles.textStyle}>Close</Text>
                       </Pressable>
                        }
                   </View>
               </View>
           </Modal>
           {/* END REGIMENITEM COMPONENT */}
           </View>
    )

}


export default RegimenItem


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
      gradientWrapper2: {
        padding: 4, // This defines the border thickness
        borderRadius: 12, // Apply border radius to the gradient
        overflow: 'hidden', // Essential for radius to work correctly
        
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