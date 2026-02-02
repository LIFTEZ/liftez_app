import React, { useEffect,useState,useRef, useLayoutEffect } from 'react';
import {View, Text, TextInput,Button, TouchableOpacity, GestureResponderEvent, Keyboard, KeyboardEvent, StyleSheet, Dimensions, ScrollView, 
InputAccessoryView, PointerEvent, TouchableWithoutFeedback, InteractionManager,
Alert, Modal, Animated, Easing, Pressable} from 'react-native'
import { Checkbox } from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {Route, useNavigation} from '@react-navigation/native'
import { useTheme } from '@/src/ThemeContext';
import log from '@/src/utils/Logger'; 
import { transform } from 'lodash';




//const STORAGE_KEY = 'inputValue'
const inputAccessoryViewID = 'uniqueID';
//get the height property from dimensions
const { height: screenHeight } = Dimensions.get('window'); // Get initial screen height

interface RouteProps {
    STORAGE_KEY: string  
}

// converting to arrow function for passing parameters
const TextArea = ({STORAGE_KEY}: RouteProps) => {

//theme context
const{theme, themeType} = useTheme()

    // SEE WHICH STORAGE KEYS EXIST
    const listAllKeys = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
        //   log.info("{31: TextArea => listAllKeys says} Stored keys:", keys);
          return keys;
        } catch (error) {
          log.error("{34: TextArea => listAllKeys says} Failed to fetch keys", error);
        }
      };

    listAllKeys()    
    

    // Done/save data button visibility
    const[isVisible, setIsVisible] = useState<boolean>(false);
    const[isFocused, setFocus] = useState<boolean | null>(null);
    const[doesDataExist, retrieveData] = useState<boolean | null>(null);
  
    // Input functionality
    const[inputValue, setText] = useState('');
    const[savedValue, getText] = useState('');
    const[prevInput, setPrevInput] = useState('');
    const[isEditing, setisEditing] = useState<boolean | undefined>(undefined);
    // const[savedValue, getText] = React.useState<string | null>(null); this isn't being used anymore

    // Keyboard height and visibility
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [keyboardVisibility, setKeyboardVisibility] = useState<boolean>(false)

    // dynamic variables 
    
    const [fontSize, setFontSize] = useState<number>(16) //default 16
    const maxFontSize = 36
    const minFontSize = 8
    const lineHeight = fontSize * 1.4; // 1.4x gives space for descenders (adjust as needed)
    const [inputHeight, setInputHeight] = useState(screenHeight * 0.8); // Initial height (e.g., 80% of screen—adjust)
    const [inputMinHeight, setInputMinHeight] = useState(200); // Dynamic min height for non-editing view
    // scroll view scrolling
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
  
    // // Define the possible types for the pointerEvents state
    // type PointerEventsType = 'auto' | 'none' | 'box-only' | 'box-none' | undefined;

    // // pointer events to prevent focus on textinput
    // const [pointerEvents, setPointerEvents] = useState<PointerEventsT>('none');

    // refs
    const inputRef = useRef<TextInput>(null)
    const scrollViewRef = useRef<any>(null); // For KeyboardAwareScrollView inner ref


    const navigation = useNavigation()

    /** CORE COMPONENT LOGIC //////////////////////////////////////////////////////////////////////
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

    //TextInput onFocus function, controls rendering of which TextInput based on isFocused and the Done button
    const toggleVisibility = () => {
        if(!isVisible ){
            log.info('{133: TextArea => toggleVisibility says} textinput is now focused and done button is visible')
            setFocus(true);
            setIsVisible(true);
            
        }
        else{
            log.info('{139: TextArea => toggleVisibility says} textinput is no longer focused and done button is not visible')
            setFocus(false);
            setIsVisible(false);
         
        }
    };

    // ASYNCSTORAGE FUNCTIONS
    interface NoteData {
        input: string
        lastModified: string
      }
      
    // STORE THE KEY VALUE
      const storeData = async (key: string, value: NoteData): Promise<void> => {
        try {
          if(value.input == ''){
            value.lastModified = ''
          }
          const jsonValue = JSON.stringify(value);
          log.info('{155: TextArea => StoreData says}', jsonValue)
          await AsyncStorage.setItem(key, jsonValue);
    
        
        } catch (error) {
          console.error("{160: TextArea => StoreData says} Error saving data", error);
        }
      };
    
    // GET THE KEY VALUE
      const getData = async (key: string): Promise<NoteData | null> => {
        try {
          const jsonValue = await AsyncStorage.getItem(key);
          // Parse the JSON string back into a User object, or return null if no value
          if (jsonValue != null) {
            const parsedValue = JSON.parse(jsonValue) as NoteData;
           // log.info('input value:', parsedValue.input);  // Logs just the 'input' value, e.g., 'some value'
            return parsedValue;
          }
          return null;
        } catch (error) {
          console.error("{176: TextArea => getData says} Error retrieving data", error);
          return null;
        }
      };
    
    // REMOVE THE STORAGE KEY
      const resetData = async (key: string): Promise<void> => {
        try {
          const jsonValue = await AsyncStorage.getItem(key);
          // Parse the JSON string back into a User object, or return null if no value
          if (jsonValue != null) {
            await AsyncStorage.removeItem(key)
           
          }
        } catch (error) {
          console.error("{191: TextArea => resetData says} Error resetting data", error);
        }
      };

    const getLastModified = async (key: string): Promise<string> =>{

      let lastModified:string = ''
       const jsonValue = await AsyncStorage.getItem(key)
       if(jsonValue){
        const parsedValue = JSON.parse(jsonValue) as NoteData
        if(parsedValue.lastModified){
          lastModified = parsedValue.lastModified
        }
       }
       return lastModified
    }

    
    //  set the text onChangeText and store the data
    const setTextData = async (newText: string) =>{

        // remove existing storage key
        if(newText == ''){
            resetData(STORAGE_KEY)
        }

        let lastModified:string = ''
        //COMPARE NEWTEXT AGAINST PREVIOUS INPUT
        if(prevInput){
          log.debug('{setTextData} prev input exists:', prevInput)
          //Remove any whitespace
          if(newText.trim() != prevInput){
            log.debug('{setTextData} previous input has been modified')
            const now = new Date
            const currentDate = now.toLocaleDateString()
            const timeString = now.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })
            lastModified = currentDate + ' ' + timeString
          }
          else{
            //function for getting the storage key item, getting the attached modified value and setting lastModified to that and returning it
            lastModified = await getLastModified(STORAGE_KEY)
          }
        }
        else{
          log.debug('{setTextData} prev input does not exist')
          const now = new Date
          const currentDate = now.toLocaleDateString()
          const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
          lastModified = currentDate + ' ' + timeString
        }


        
        if(newText.length > 0){
        //get last character typed I can use this for several inputs ***
            const lastTypedChar = inputValue.slice(-1);
            log.info('{206: TextArea => setTextData says} Last typed character:', lastTypedChar);
            //LOGIC TO APPLY CURRENT HOUR IN 12 TIME FORMAT WITH MINUTES AFTER @ character IS DETECTED AS LAST CHARACTER INPUTED
            if(lastTypedChar == "@"){
                const now = new Date()
                const timeString = now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
                const newString = newText.slice(0,-2) //remove the ampersand and add it with space
                newText = newString + '@ ' + timeString 
            }

            if(lastTypedChar == '-'){
                const newString = newText.slice(0,-2) //remove the typed - because I want to indent and then add the dash
                newText = newString + '   -  '
            }
        }

        log.debug('last modified:', lastModified)

        storeData(STORAGE_KEY, {input: newText, lastModified:lastModified})
        getData(STORAGE_KEY).then((data) => {
            if (data) {
              setText(data.input)
            }
        })
       
    }



    // DONE BUTTON FUNCTION, NO LONGER DEPENDENT ON DATA
      const onPress = () =>{
        log.info('{237: TextArea => onPress says} this button was pressed')
        setIsVisible(false) //hide done button
        inputRef.current?.blur() //force focus off from TextInput
        Keyboard.dismiss() //dismiss keyboard
        return
      
      }

    // CLEAR BUTTON FUNCTION, RESET ASYNCSTORAGE KEY
      const onReset = (e: GestureResponderEvent) =>{
        const textInput = inputValue //input value is the useState value from setText()
        //also figure out state management if i should use Zustand for larger data
        Alert.alert(            
            '',
            "WARNING: Are you sure you want to delete all the text in this entry?",
            [
                {
                    text: "Yes",
                    onPress: () =>{    
                        setFocus(true)
                        setIsVisible(false)
                        setText('')
                        Keyboard.dismiss()
                        resetData(STORAGE_KEY)
                        return
                    },
                    style:'destructive'
                },
                {
                    text: "No",
                    onPress: () =>{
                        return
                    },
                    style:'cancel'
                }
            ]
          )
          
      }

    // Dont think this actually works or triggers
    const startEditing = () => {
        log.info('{259: TextArea => startEditing says} editing has started')
        setisEditing(true);
        inputRef.current?.focus();
      };
    // // Handle content size change for dynamic height in non-editing mode
    // const handleContentSizeChange = (width: number, height: number) => {
    //     setInputMinHeight(height); // Grow to fit content when not editing
    //     if (scrollViewRef.current && isEditing) {
    //     inputRef.current?.measure((x, y, w, h, pageX, pageY) => {
    //         const scrollPosition = height - h;
    //         scrollViewRef.current.scrollTo({ y: Math.max(0, scrollPosition), animated: true });
    //     });
    //     }
    // };

      //NEW FEATURE NOTIF

      const comingSoon = (feature:string)=>{
        Alert.alert(            
          `FEATURE:${feature}`,
          "COMING SOON!",
          [
              {
                  text: "OK",
                  onPress: () =>{    
                    
                      return
                  },
                  style:'default'
              },
            
          ]
        )

      }

    /** INPUTACCESSORYVIEW FUNCTIONS /////////////////////////////////////////////////////
     * 
     * 
     * 
     * 
     * 
     * 
     */


    const incrementFontSize = () => {

        if(fontSize != maxFontSize){
        const size = fontSize + 2
        setFontSize(size)
        }
        else{
            log.info('max font-size reached')
        }
    }

    const decrementFontSize = () =>{
        if(fontSize != minFontSize){
        const size = fontSize - 2
        setFontSize(size)
        }
        else{
            log.info('min font-size reached')
        }

    }



    /**
     * ALL USE EFFECTS GO BELOW THIS BLOCK //////////////////////////////////////////////////
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */
    ///////////////////////////////////////////////////////////////////////////////////

    // check storage key value and save the current value of it if it isn't null
    useEffect(()=>{
        
        const getPrevInput = async (): Promise<void> => {

            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
            if(jsonValue){
              const parsedValue = JSON.parse(jsonValue) as NoteData
              if(parsedValue.input){
                log.debug('parsed input', parsedValue.input)
                setPrevInput(parsedValue.input)
              }
              //parse the value and get input and set it as a usestate variable
              log.debug('value exists save to useState as previous input variable')
            }
            else{
              log.debug('no value exists')
              return
            }
        }
        getPrevInput()
        log.debug('prev input:', prevInput)

    },[STORAGE_KEY, prevInput])
    
    // Prevent the Done button from disappearing if the keyboard doesn't fully disappear
    useEffect(()=>{
        log.info('{334: TextArea => useEffect says} keyboard status:',keyboardVisibility)
        if(keyboardVisibility){
            setIsVisible(true)
        }else{
            setIsVisible(false)
                     
        }
    },[keyboardVisibility])

    // Set keyboard visibility for the above function so the Done button has something to check to confirm the keyboard disappeared or just bounced
    useEffect(()=>{
        log.info('{345: TextArea => useEffect says} new keyboard height:', keyboardHeight)
        if(keyboardHeight == 0){
            setKeyboardVisibility(false)
        }
        else{
            setKeyboardVisibility(true)
        }
    },[keyboardHeight])


    //Get keyboard height by adding keyboard listeners
    useEffect(() => {
        const onKeyboardShow = (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
        setFocus(true)
        };
    
        const onKeyboardHide = () => {
        setKeyboardHeight(0);
        setFocus(false)
        };
    
        log.info(keyboardHeight)
        // Add listeners for keyboard events
        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
    
        // Clean up listeners on component unmount
        return () => {
        showSubscription.remove();
        hideSubscription.remove();
        };
        
    }, [keyboardHeight]);
      
    // Dynamically calculate input height: screen height minus keyboard (plus any offsets like status bar)
    useEffect(() => {  
        const newHeight = screenHeight - keyboardHeight - 100; // Subtract keyboard + buffer (e.g., for status bar/padding—adjust)
        setInputHeight(newHeight > 200 ? newHeight : 200); // Min height to avoid squishing
    }, [keyboardHeight]); // Re-calc when keyboard changes   



    // load saved data if it exists on initial mount
      useEffect(() =>{
        getData(STORAGE_KEY).then((data) => {
          if (data) {
            setText(data.input); // Set if something is saved
            setisEditing(false)
            setFocus(false)
            setKeyboardVisibility(false)
            setTimeout(()=>{
                setisEditing(true)
            },300)
            if(data?.input){
                retrieveData(true)
                // log.info('saved text data was found:',data.input)
            }  
          }
          else{
            log.info('{400: TextArea => useEffect says} saved data does not exist')
            setFocus(true)
          }
        });
      },[]);
    
      useEffect(()=>{
        log.info('{407: TextArea => useEffect says} input focus status:', isFocused)

      },[inputRef.current?.isFocused()])


    // watch the scrolling status 
    useEffect(()=>{
        log.info('{414: TextArea => useEffect says} scroll view is scrolling:',isScrolling)
        if(isScrolling){
          setisEditing(false)
        }
        else{
          setisEditing(true)
        }
    },[isScrolling])


    const[isInput, setIsInput] = useState<boolean>(false)
    useEffect(()=>{
        
        log.info('{427: TextArea => useEffect says} input value length:', inputValue.length)
        if(inputValue.length > 0){
            
            setIsInput(true)
        }else{
            setIsInput(false)
        }

        log.info('{435: TextArea => useEffect says} input value:', inputValue)

       


    },[inputValue])


    const[wasTextTipSeen, setWasTextTipSeen] = useState<boolean>(false)
    const[showTip, setShowTip] = useState<boolean>(true) //set this to default of true unless asyncstorage key exists where user chose to not see the tip again
    const[isTipModalVisible, setIsTipModalVisible] = useState<boolean>(false)
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const[isShaking,setIsShaking] = useState<boolean>(false)
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);
    const[isChecked, setIsChecked] = useState<boolean>(false)

    // Make it so position resets each time to normal
    // Also only run as long as the Tip hasn't been seen
    const animateTipNotif = async () =>{
      
      const startLoop = (ms:number, result:boolean): Promise<boolean> =>{
        return new Promise((resolve) =>{
          setTimeout(()=>{
            resolve(result)
          },ms)
        })
      } 
        const shakeSequence = Animated.sequence([
          Animated.timing(shakeAnimation, { toValue: 3, duration: 300, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: -3, duration: 300, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true }),
          
        ]);

        const loop = Animated.loop(shakeSequence);
        animationRef.current = loop
        
      if( await startLoop(5000,true)){
        console.log('starting shaking')
      setIsShaking(true)
      loop.start((done) =>{

        if(done){
          
        }
      });
      }
  
      const stopLoop = (ms:number, result:boolean): Promise<boolean> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(result);
          }, ms);
        })

      }

      const loopStopped = await stopLoop (3000, true)

      if(loopStopped){
        setTimeout(async ()=>{
          console.log('shaking set to false')
          loop.stop()
          setIsShaking(false)
        },3000)
      }
      
      


    }

    const animatedStyle = {
      transform: [
        // {translateX: shakeAnimation.interpolate({
        //   inputRange: [-3, 3],
        //   outputRange: [-1, 1],
        // })},
        //input range must be min and max of the values set in the sequence
        //output range can be whatever I want
        {translateX:shakeAnimation.interpolate({
          inputRange: [-3, 3],
          outputRange: [-3, 3],
        })},
          {rotate: shakeAnimation.interpolate({
          inputRange: [-3, 3],
          outputRange: ['-10deg', '10deg'],
        })},
          {scale: shakeAnimation.interpolate({
          inputRange: [-3, 3],
          outputRange: [.8,1.5],
        })},
        
      ],
      
    }

    //user selects the checkbox option to not show tip icon and modal anymore
    const neverShowTip = async() =>{

        const key:string = 'disable_tip'
        await AsyncStorage.setItem(key, 'true')
        setShowTip(false)
    }

    //get the storage key
    const checkTip = async()=>{

       const key:string = "disable_tip"

       const value = await AsyncStorage.getItem(key)

       if(value){
        setShowTip(false)
       }
       else{
        return
       }

    }
    //dev //run once to get Tip icon and modal to display again
    // const removeTipkey = async () =>{
    //   await AsyncStorage.removeItem('disable_tip')
    // }
   
    // useEffect(()=>{
      
    //   removeTipkey()
     
    // })

    //check if tip icon should be shown, set in production
    // useEffect(()=>{
    //     checkTip()
    // },[])

    useEffect(()=>{
      if(!isTipModalVisible && !isShaking && !wasTextTipSeen && showTip){
        
          animateTipNotif()
        
      
      }
    

    },[isShaking])

    //check if tip has been checked
    useEffect(()=>{

      checkTip() //remove to see the tip still while in dev mode even if checkbox is checked
    },[wasTextTipSeen])


// CONDITIONAL RENDERING FOR NAVIGATOR HEADER
useLayoutEffect(() => {
    setTimeout(()=>{
    const entryName = STORAGE_KEY.split('_')[0]
    const entryIndex = STORAGE_KEY.split('_')[1]
    
    const title = `${entryName} ${entryIndex}`
        navigation.setOptions({
          headerLeft: () => {
            if (inputValue.length > 0 && !isVisible) {
              return (
                <View className='flex'>
                  <View className='flex flex-row justify-center items-center'>
                    {/* FUTURE IMPLEMENTATION EMAIL THE INPUT */}
                    <View className='pl-4 pr-2'>
                      <TouchableOpacity onPress={() => [console.log('this is pressed') , comingSoon('Automatic Scheduled Emails!')]}>
                        <MaterialIcons name="schedule" size={24} color={themeType.textPrimary} />
                      </TouchableOpacity>
                    </View>
                    <View className='pl-2 pr-2 mt-1'>
                      <TouchableOpacity onPress={()=> comingSoon('Emailing!')}>
                        <MaterialIcons name="attach-email" size={24} color={themeType.textPrimary} />
                      </TouchableOpacity>
                    </View>
                    <View className='pl-2 pr-2'>
                      <TouchableOpacity onPress={() => [console.log('settings pressed, manage macros'), comingSoon('Text Macros!')]}>
                        <MaterialIcons name="settings" size={24} color={themeType.textPrimary} />
                      </TouchableOpacity>
                    </View>
                    {showTip?
                    !wasTextTipSeen?
                    <View className=' pr-4'>
                      <Animated.View
                        style={[animatedStyle]}
                        >
                      <TouchableOpacity onPress={() => [setIsTipModalVisible(true), animationRef.current?.stop()]}>
                        
                        <AntDesign name="exclamation" size={24} color='lime' />
                        
                       
                      </TouchableOpacity>
                      </Animated.View>
                    </View>
                    :null
                    :null}
                  </View>
                </View>
              );
            }
            return null; 
          },
          headerRight:() =>{
            if(inputValue.length > 0 && !isVisible){
              return(
                  <View className='flex'>
                    <View className='flex flex-row'>
                        <TouchableOpacity className='pl-2 pr-2' onPress={onReset}>
                        <Text className='text-xl ' style={{color:themeType.textPrimary}}>Clear</Text>
                        </TouchableOpacity>
                  </View>
                  </View>
              )
            }
            if(isVisible){
              return(
                <TouchableOpacity className='' onPress={onPress}>
                  <Text style={{color:'#00bc7d'}}className='text-xl pl-2 pr-2'>Done</Text>
                  </TouchableOpacity>
              )
            }  
            return null
          }  
        });
    },300)
}, [isVisible, navigation, inputValue, wasTextTipSeen, showTip]); // Re-run when isVisible changes

 

    return (
        <View className='w-full h-full bg-neutral-50'>       
            <View 
            style={[styles.container, {backgroundColor:themeType.screenBg}]}>
                <KeyboardAwareScrollView
                innerRef={(ref) => { scrollViewRef.current = ref; }}
                extraScrollHeight={-20} // Buffer for status bar/toolbars—adjust to avoid clipping
                keyboardDismissMode="interactive" // Keeps swipe-down dismissal
                keyboardShouldPersistTaps="handled" // Taps don't dismiss unless intended
                 onScrollBeginDrag={() => setIsScrolling(true)}
                 onScrollEndDrag={() => setIsScrolling(false)}
                 onMomentumScrollBegin={() => setIsScrolling(true)}
                 onMomentumScrollEnd={() => setIsScrolling(false)}
                 scrollEventThrottle={16}
                 enableAutomaticScroll={true}
                
                // resetScrollToCoords={{ x: 0, y: 0 }} // Resets on hide for consistency
                >
                <TouchableWithoutFeedback onPress={startEditing} disabled={isEditing}>
                    <View>
                        {doesDataExist ? 
                            (<>
                            <TextInput
                            keyboardAppearance={theme == 'light'? 'light':'dark'}
                            ref={inputRef}
                            className=''
                            // style={[styles.input,{fontSize, lineHeight,height: isEditing ? inputHeight : undefined, minHeight: !isEditing ? inputMinHeight : undefined }]}
                            style={[styles.input,{fontSize, lineHeight, height:keyboardVisibility && isFocused ? inputHeight : '100%', color:themeType.textPrimary}]}
                            textAlignVertical="center"
                            autoFocus={keyboardVisibility? true : false}
                            selectionColor={'#52eb34'} 
                            onFocus={toggleVisibility}
                            multiline={true}
                            editable={isEditing}
                            scrollEnabled={isFocused?true:false}
                            value={inputValue} 
                            onChangeText={setTextData}
                            inputAccessoryViewID={inputAccessoryViewID}
                            // onContentSizeChange={({ nativeEvent: { contentSize } }) =>
                            //     handleContentSizeChange(contentSize.width, contentSize.height)
                            //   }
                            />
                            {isFocused?
                                <InputAccessoryView nativeID={inputAccessoryViewID}>
                                
                                <View className='flex flex-row h-12  justify-center items-center bg-slate-800/50 rounded-lg mb-2'>
                                <Text>
                                COMING SOON: Macros not available yet!
                              </Text>
                                    {/* <TouchableOpacity  onPress={incrementFontSize}>
                                        <MaterialCommunityIcons name="format-font-size-increase" className='mr-10' size={32} color="#0bfc03" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={decrementFontSize}>
                                        <MaterialCommunityIcons name="format-font-size-decrease" className='' size={32} color="#fc0303" />
                                    </TouchableOpacity> */}
                                </View>
                            </InputAccessoryView> 
                            :null}
                              
                            </>)   
                            :(<>
                            {/* // IF NO SAVED DATA */}
                            <TextInput
                            keyboardAppearance={theme == 'light'? 'light':'dark'}
                            ref={inputRef}
                            className='text-3xl'
                            // style={[styles.input,{fontSize, lineHeight,height: isEditing ? inputHeight : undefined, minHeight: !isEditing ? inputMinHeight : undefined }]}
                            style={[styles.input,{fontSize, lineHeight, height:keyboardVisibility ? inputHeight : '100%', color:themeType.textPrimary}]}
                            textAlignVertical="center"
                            autoFocus={true}
                            selectionColor={'#52eb34'} 
                            onFocus={toggleVisibility}
                            multiline={true}
                            value={inputValue}
                            scrollEnabled={isFocused?true:false}
                            onChangeText={setTextData}
                            inputAccessoryViewID={inputAccessoryViewID}
                            // onContentSizeChange={({ nativeEvent: { contentSize } }) =>
                            //     handleContentSizeChange(contentSize.width, contentSize.height)
                            //   }
                            />
                            <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View className='flex flex-row h-12  justify-center items-center bg-slate-800/50 rounded-lg mb-2'>
                              <Text>
                                COMING SOON: Macros not available yet!
                              </Text>
                                {/* <TouchableOpacity  onPress={incrementFontSize}>
                                    <MaterialCommunityIcons name="format-font-size-increase" className='mr-10' size={32} color="#0bfc03" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={decrementFontSize}>
                                    <MaterialCommunityIcons name="format-font-size-decrease" className='' size={32} color="#fc0303" />
                                </TouchableOpacity> */}
                            </View>
                            </InputAccessoryView> 
                            </>)  
                        } 
                    </View>
                </TouchableWithoutFeedback>
                
                
                </KeyboardAwareScrollView>
            </View>
                        
                  {/* TIP MODAL */}
                  <View>
                      <Modal
                      visible={isTipModalVisible}
                      transparent={true}
                      animationType='fade'
                      
                      >
                        <View style={styles.centeredView}>
                          <View style={[styles.modalView,{width:'85%', backgroundColor:'#c7c7c7'}]} className='h-[30%]'>
                            <View>
                              <View className='flex flex-row justify-center'>
                              <Text style={styles.modalTitle}>
                                HIDDEN FEATURE
                              </Text>
                              <Text className='ml-2' style={{color:'lime', marginTop:-10, fontSize:36,transform:[{rotate:'10deg'}]}}>!</Text>
                              </View>
                            <Text style={styles.modalText}>While typing use @ followed by a space to automatically create a current time stamp in hour and minutes </Text>
                          
                          
                            </View>
                              <View className='flex w-full justify-start mb-2'>
                                  <View className='flex flex-row items-center'>
                                  <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked ?? undefined}
                                    onValueChange={setIsChecked}
                                    color={isChecked ? '#00bc7d' : undefined}
                                  />
                                  <Text style={{fontWeight:500}}>Don't show this tip again</Text>
                                  </View>
                                </View>
                                <TouchableOpacity onPress={()=>[setIsTipModalVisible(false), setWasTextTipSeen(true), isChecked?neverShowTip():null]} className='border-1  w-full p-4 mt-4' style={{borderRadius:20, backgroundColor:'#949494'}}>
                                {/* CHECKBOX */}
                               
                                <Text  className='text-center' style={{fontSize:18, fontWeight:500}}>
                                  OK
                                </Text>
                                </TouchableOpacity>
                           
                          </View>
                        </View>
                         
                      
                      </Modal>

                </View>
            
        </View>
        
    )
}

export default TextArea;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding:0
    },
    input: {  
      padding: 16, // Internal padding for comfort
      textAlign: 'left', // Horizontal alignment (change to 'center' if needed)
    },
    scrollContainer:{
    flex:1
    },
    inputAccessory:{
        backgroundColor:'green'
    },
    checkbox: {
      margin: 4,
      padding:8,
    },
    //MODAL STYLES
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'transparent'
    },
    modalView: {
      margin: 20,
      borderRadius: 30,
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
    modalTitle: {
      marginBottom: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    }
  });