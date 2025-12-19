import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import EditInput from './components/EditInput';
import TextArea from './components/TextArea';

import "./global.css"


export default function App() {


 

  return (
    <SafeAreaProvider>
      {/* bg-white only applies to mobile app because browser doesn't account for safe area, change to whatever color I want if I don't want a white background */}
      <SafeAreaView className='bg-white w-full h-full'>

            {/* EDIT INPUT COMPONENT TESTING PURPOSES */}
            {/* <EditInput>

            </EditInput> */}
            {/* NOW CREATE A NON INPUT COMPONENT WHERE IT IS FREE EDITING AT ALL TIMES SAVING WITH ASYNC STORAGE */}
            <TextArea>
              
            </TextArea>
            
          
          <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    width:'100%',
    height:'100%'
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
