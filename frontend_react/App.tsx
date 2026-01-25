import React, {useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import "./global.css"
import * as Font from 'expo-font'
// Sub-component to use the hook for dynamic styling
// 
function ThemedSafeArea() {
  //theme context
  const { themeType } = useTheme(); // Access theme here (inside provider)

  return (
    // required for swipping context
    <GestureHandlerRootView>
    <SafeAreaView  className='w-full h-full' style={{ backgroundColor: themeType.headerBg }}>
      <TabNavigator/>
    </SafeAreaView>
    </GestureHandlerRootView>
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
