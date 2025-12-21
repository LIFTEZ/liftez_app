import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import EditInput from './components/EditInput';
import TextArea from './components/TextArea';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import AppNavigator from './src/navigation/navigator'
import "./global.css"


export default function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* bg-white only applies to mobile app because browser doesn't account for safe area, change to whatever color I want if I don't want a white background */}
        <SafeAreaView className='bg-white w-full h-full'>

              {/* EDIT INPUT COMPONENT TESTING PURPOSES */}
              {/* <EditInput>

              </EditInput> */}
              {/* NOW CREATE A NON INPUT COMPONENT WHERE IT IS FREE EDITING AT ALL TIMES SAVING WITH ASYNC STORAGE */}
             <AppNavigator/>

   
              
            
            {/* <StatusBar style="auto" /> */}
        </SafeAreaView>
      </NavigationContainer>
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
