import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput,  TextInputEndEditingEvent, FocusEvent, BlurEvent} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'inputValue'
export default function EditInput(){


const[inputValue, setText] = React.useState('')
const[savedValue, getText] = React.useState<string | null>(null);
  //figure out how to reset the text in real time without requiring refresh using the input "reset" to mimic a reset button
  
  interface TextInput {
    input: string
  }

  const storeData = async (key: string, value: TextInput): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log(jsonValue)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const getData = async (key: string): Promise<TextInput | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      // Parse the JSON string back into a User object, or return null if no value
      if (jsonValue != null) {
        const parsedValue = JSON.parse(jsonValue) as TextInput;
        console.log('input value:', parsedValue.input);  // Logs just the 'input' value, e.g., 'some value'
        return parsedValue;
      }
      return null;
    } catch (error) {
      if(savedValue != null)
      console.error("Error retrieving data", error);
      return null;
    }
  };

  const resetData = async (key: string): Promise<void> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      // Parse the JSON string back into a User object, or return null if no value
      if (jsonValue != null) {
        await AsyncStorage.removeItem(key)
       
      }
    } catch (error) {
      console.error("Error resetting data", error);
    }
  };




 
  // Can also use e: TextInputEndEditingEvent and change onBlur to onEndEditing, but onEndEditing doesn't work on web
  const handleInputOnBlur = (e: FocusEvent) =>{
    const textInput = inputValue //input value is the useState value from setText()
 
    //also figure out state management if i should use Zustand for larger data
    
    if(textInput.toLowerCase() == 'reset'){
      setText('')
      getText(null)
      resetData(STORAGE_KEY)
      return
    }
   
    if(textInput == '')
      return


    setText('')
    storeData(STORAGE_KEY, { input: textInput })
    getData(STORAGE_KEY).then((data) =>{
      if(data)
      getText(data?.input)
    })
   
  
    
  }

  useEffect(() =>{
    getData(STORAGE_KEY).then((data) => {
      if (data) {
        getText(data.input); // Set if something is saved
      }
      // No else needed—savedValue stays null if nothing saved, so conditional shows inputValue
    });

  },[]);

  return (
    
          <View className='w-auto'>
            <Text className='font-bold text-blue-500'>Open up App.tsx to start working on your app!</Text>
            <TextInput 
              className='h-auto p-4 border-2 rounded-lg mt-2' 
              inputMode='text' 
              numberOfLines={1}  
              onChangeText={setText}
              // onEndEditing={handleInputOnBlur} 
              onBlur={handleInputOnBlur}
              value={inputValue} 
              placeholder="Enter text here"
            />
            {savedValue ? (
              <View className='flex flex-col'>
                  <Text className='p-2 mt-2'>
                  Display text: {inputValue} 
                  </Text>
                  <Text  className='pl-2'> 
                    Saved text: {savedValue} 
                  </Text>
                </View>
              ) : (
                <Text className='p-2 mt-2'>
                Display text: {inputValue}
              </Text>
              )
            }
          </View>
    

  );
}