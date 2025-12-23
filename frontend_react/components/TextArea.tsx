import React, { useEffect,useState,useRef, useLayoutEffect } from 'react';
import {View, Text, TextInput,Button, TouchableOpacity, GestureResponderEvent, Keyboard, KeyboardEvent, StyleSheet, Dimensions, ScrollView, 
InputAccessoryView, PointerEvent, TouchableWithoutFeedback, InteractionManager,
Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Route, useNavigation} from '@react-navigation/native'
import { useTheme } from '@/src/ThemeContext';
import log from '@/src/utils/Logger'; 




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
    //RETURN FROM EATING
    /**
     * NOTE:
     * - RESOVLED still might be some inconsistency with the scrolling not sure
     * - RESOLVED (i think) also very bad bouncing when using the space bar alot
     * 
     * 
     * FUTURE THINGS:
     * Getting font size to work for each individual new line instead of all the text
     *      - NOT POSSIBLE IN MULTILINE TEXTINPUT
     *      - react-native-pell-rich-editor or react-native-rich-editor REQUIRED 
     *          - this will also allow me to add other formatting tools
     *          - would work with asyncstorage 
     *               - Serialize the editor's content to a string (e.g., HTML or a JSON array like [{ char: 'a', size: 16 }, { char: 'b', size: 24 }]) on blur or "Done" press.
     * 
     * 
     * 
     * Issues:
     * RESOLVED - Line height still cuts off on j g and similar characters
     * RESOLVED - When focusing on the TextInput it dismisses the keyboard on first attempt for some reason
     * RESOLVED - Done disappears when keyboard is not fully dismissed on swipe sometimes
     * NOT NEEDED - Figure out how to save the data on keyboard dismissal
     * RESOLVED - Keyboard gets stuck now when trying to dismiss it without an abrupt swipe
     * RESOLVED - Keyboard doesn't smoothly transition out on scrolling up
     * RESOLVED - Focus status gets set to true on refresh for some reason once data is saved
     * NOT NEEDED - Still need to make it so the keyboard dismissal causes the data to be saved
     * RESOLVED scrollview onScroll event is not consistently firing so i can't gauge its value and status 
     * RESOLVED I THINK - InputAccessory not being fully attached to keyboard, when keyboard dimisses you see a litle margin/gap between them
     * RESOLVED - Without height set on TextInput I can't scroll it while its focused, but I can scroll the scrollview without autofocusing
     * RESOLVED - With height set on TextInput I can scroll it while its focused, but keyboard dismiss clips the text and scrolling while the TextInput is not focused
     *   causes it to autofocus so I can't freely scroll the scrollview
     * RESOLVED - On focus with nothing saved causes the scrollview to scroll to bottom for some reason causing the caret to go above the header
     *              -just had to adjust the extrascrollheight on scrollview and the inputHeight buffer
     * 
     * 
     */




    // Done/save data button visibility
    const[isVisible, setIsVisible] = useState<boolean>(false);
    const[isFocused, setFocus] = useState<boolean | null>(null);
    const[doesDataExist, retrieveData] = useState<boolean | null>(null);
  
    // Input functionality
    const[inputValue, setText] = useState('');
    const[savedValue, getText] = useState('');
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
      }
      
    // STORE THE KEY VALUE
      const storeData = async (key: string, value: NoteData): Promise<void> => {
        try {
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
    
    //  set the text onChangeText and store the data
    const setTextData = (newText: string) =>{
        // remove existing storage key
        if(newText == ''){
            resetData(STORAGE_KEY)
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
        storeData(STORAGE_KEY, {input: newText})
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

// CONDITIONAL RENDERING FOR NAVIGATOR HEADER
useLayoutEffect(() => {
    setTimeout(()=>{
    const entryName = STORAGE_KEY.split('_')[0]
    const entryIndex = STORAGE_KEY.split('_')[1]
    
    const title = `${entryName} ${entryIndex}`
        navigation.setOptions({
            headerRight: () => (
                <View className='flex'>
                    <View className='flex flex-row'>
                        {inputValue.length > 0?
                        <TouchableOpacity className='' onPress={onReset}>
                        <Text className='text-xl ' style={{color:themeType.textPrimary}}>Clear</Text>
                        </TouchableOpacity>
                        :null}
                    { isVisible ? 
                    <TouchableOpacity className='' onPress={onPress}>
                        <Text style={{color:'#00bc7d'}}className='text-xl ml-6'>Done</Text>
                    </TouchableOpacity> : null
                    }
                    </View>
                </View>
            ),
            title: title.toUpperCase()
        });
    },300)
}, [isVisible, navigation, inputValue]); // Re-run when isVisible changes

 

    return (
        <View className='w-full h-full bg-neutral-50'>
                {/*THIS RENDERS FROM THE HEADER NOW  VIA USELAYOUTEFFECT*/}
                {/* <View className='flex flex-row justify-between  p-4'>
                    <View className='flex justify-center'>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <View className='flex flex-row '>
                            <Text className='text-lg'>←</Text>
                            <Text className='text-xl'> Back</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className='flex'>
                        <View className='flex flex-row'>
                            <TouchableOpacity className='' onPress={onReset}>
                            <Text className='text-xl'>Clear</Text>
                            </TouchableOpacity>
                        { isVisible ? 
                        <TouchableOpacity className='' onPress={onPress}>
                            <Text className='text-blue-500 text-xl ml-6'>Done</Text>
                        </TouchableOpacity> : null
                        }
                        </View>
                    </View>
                   
                </View> */}

         
                
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
                                
                                <View className='flex flex-row h-12  justify-center items-center bg-slate-800/50'>
                                    <TouchableOpacity  onPress={incrementFontSize}>
                                        <MaterialCommunityIcons name="format-font-size-increase" className='mr-10' size={32} color="#0bfc03" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={decrementFontSize}>
                                        <MaterialCommunityIcons name="format-font-size-decrease" className='' size={32} color="#fc0303" />
                                    </TouchableOpacity>
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
                            <View className='flex flex-row h-12  justify-center items-center bg-slate-800/50'>
                                <TouchableOpacity  onPress={incrementFontSize}>
                                    <MaterialCommunityIcons name="format-font-size-increase" className='mr-10' size={32} color="#0bfc03" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={decrementFontSize}>
                                    <MaterialCommunityIcons name="format-font-size-decrease" className='' size={32} color="#fc0303" />
                                </TouchableOpacity>
                            </View>
                            </InputAccessoryView> 
                            </>)  
                        } 
                    </View>
                </TouchableWithoutFeedback>
                
                
                </KeyboardAwareScrollView>
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
    }
  });