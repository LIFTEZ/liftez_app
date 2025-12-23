import React, {useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import EditInput from './components/EditInput';
import TextArea from './components/TextArea';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import AppNavigator from './src/navigation/navigator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import "./global.css"
import * as Font from 'expo-font'
// Sub-component to use the hook for dynamic styling
function ThemedSafeArea() {
  //theme context
  const { themeType } = useTheme(); // Access theme here (inside provider)

  return (
    <SafeAreaView  className='w-full h-full' style={{ backgroundColor: themeType.headerBg }}>
      <AppNavigator/>
    </SafeAreaView>
  );
}

export default function App() {

  //Load font universally
  useEffect(()=>{
    const loadMyFonts = async () =>{
        await Font.loadAsync({
            'ScienceGothic-Regular': require('./assets/fonts/ScienceGothic-Regular.ttf')
        })
    }
   loadMyFonts(); 
},[])


  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <NavigationContainer >
         <ThemedSafeArea/>
          {/* <StatusBar style="auto" /> */}
      </NavigationContainer>
      </ThemeProvider>
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
