import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from './utils/Logger';

interface ThemeContextType {
  themeType: typeof lightTheme; // Or darkTheme—type based on the object shape
  theme: string | null;
  ToggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme = {
  safeAreaBg: '#ffffff', // White for safe area
  headerBg: '#f0f0f0', // Light gray for header
  screenBg: '#fafafa', // slightly darker white
  componentBg: '#d0d0d0', // Even darker for components like buttons/cards
  textPrimary: '#000000', // Black text
  textPrimary2: '#ffffff', // white text for flatlist items
  accent: '#007bff', // Blue accent
  modal: 'rgba(98, 116, 142, 0.75)',
  icon: '#00bc7d'

  // Add more granular keys as needed, e.g., buttonText: '#ffffff'
};

const darkTheme = {
  safeAreaBg: 'rgba(54, 54, 54)', // Black for safe area
  headerBg: '#292929', // Dark gray for header
  screenBg: '#121212', // Slightly lighter dark for screen background
  componentBg: '#2a2a2a', // Lighter still for components
  textPrimary: '#ffffff', // White text
  textPrimary2: '#ffffff', // white text for flatlist items
  accent: '#0d6efd', // Darker blue accent
  modal: 'rgba(29, 41, 61, 0.75)',
  icon: '#fafafa'
  // Mirror lightTheme keys
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    
const[theme, setTheme] = useState<string | null>(null)

const themeKey = 'theme'

const storeTheme = async (value: string) => {

    try{
        const keys = await AsyncStorage.getAllKeys()

        if(keys.includes(themeKey)){
            log.info('{49: ThemeContext => storeTheme says} theme key already exists')
            const themeValue = await AsyncStorage.getItem(themeKey)
            if(themeValue == value){
                log.info('{52: ThemeContext => storeTheme says} theme has not changed nothing to do')
                return
            }
            else{
                log.info('{56: ThemeContext => storeTheme says} changing theme')
                if(value)
                await AsyncStorage.setItem(themeKey,value)
            }
        }
        else{
        //else set it to light by default
        await AsyncStorage.setItem(themeKey, 'light');
        }

    }
    catch (error) {
        log.error("{68: ThemeContext => storeTheme says} Error saving data", error);
    }

}

const getTheme = async () =>{
    try{
        const themeValue = await AsyncStorage.getItem(themeKey)
        if(themeValue)
        setTheme(themeValue)
    }
    catch(error){
        log.error("{80: ThemeContext => getTheme says} Error retrieving theme", error)
    }
}



const ToggleTheme = () => {

    if(theme == 'light'){
        setTheme('dark')
    }
    else{
        setTheme('light')
    }

}

//set theme key and value
useEffect(()=>{
    if(theme)
    storeTheme(theme)

},[theme])


//get the theme on load
useEffect(()=>{

    getTheme()
    log.info('{109: ThemeContext => useEffect says} setting theme to:', theme)
},[])


const themeType = theme == 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeType, theme, ToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('{125: ThemeContext => useTheme says} useTheme must be used within a ThemeProvider');
  }
  return context;
};