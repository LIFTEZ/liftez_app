import React, { createContext, useContext, useState, useEffect } from 'react';
import {View,Text, StyleSheet} from 'react-native'
import { useTheme } from './ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import log from '@/src/utils/Logger'
import StepVisualizer from '../components/RegimenBuilder/BuildStepVisualizer';

interface RegimenContextType {
    something:string
}


interface BuilderProps{
    children: React.ReactNode
    Step:number
}



const RegimenContext = createContext<RegimenContextType | undefined>(undefined);

const RegimenProvider = ({children,Step}: BuilderProps) => {
const {themeType} = useTheme()

const something = 'stuff'
log.debug('{Step:}',Step, 'of the regimen builder')

    return (

        <RegimenContext.Provider value={{something}}>
                <View className='h-full w-full' style={[styles.container, {backgroundColor: themeType.screenBg}]}>
                    <View className='p-4'>
                        <Text style={[styles.titleText,{color:'#00bc7d'}]}><Entypo name="tools" size={24} color={themeType.textPrimary} /> REGIMEN BUILDER <Entypo name="tools" size={24} color={themeType.textPrimary} /></Text>
                        <StepVisualizer Step={Step}/>
                    {children}
                    </View>
                </View>
        </RegimenContext.Provider>

    )
}

export default RegimenProvider


export const useRegimen = () => {
    const context = useContext(RegimenContext);
    if (!context) {
      throw new Error('{33: RegimenContext => useRegimen says} useRegimen must be used within a RegimenProvider');
    }
    return context;
  };

const styles = StyleSheet.create({

    container:{
        //backgroundColor:'rgba(3, 252, 20, 1)',
        padding:10
    },
    titleText:{
        textAlign:'center',
        fontSize:24,
        fontFamily:'ScienceGothic-Regular'
    }

})