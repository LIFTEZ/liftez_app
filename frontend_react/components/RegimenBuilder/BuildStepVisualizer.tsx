import {View,Text, StyleSheet} from 'react-native'
import { useEffect, useState } from 'react'
import log from '@/src/utils/Logger'
import { useTheme } from '@/src/ThemeContext'

interface RouteProps{
    Step: number

}


const StepVisualizer = ({Step}: RouteProps) =>{

    const {themeType} = useTheme()

    useEffect(()=>{
        log.debug('this is the current step of the regimen builder:', Step)
     
    },[Step])


    // const getStep = () =>{

    //     const styles = {
    //         1: { backgroundColor: 'red' },
    //         2: { backgroundColor: 'yellow' },
    //         3: { backgroundColor: 'green' },
    //       }
        
    //         log.debug(styles[isStep as keyof typeof getStep] )
    //     return styles[isStep as keyof typeof getStep]
        
    // }


    if(Step == 0){
        return
    }else{
        return (

            <View>
                <View className='w-full flex flex-row justify-center items-center mt-4'>
                    <View style={[styles.lineStyle, {borderColor:Step == 1 ?'lime': themeType.textPrimary}]}/>
                    <Text style={{color:Step == 1?'lime': themeType.textPrimary, fontFamily:'ScienceGothic-Regular'}}>
                        SELECT
                    </Text>
                    <View style={[styles.lineStyle, {borderColor:Step == 1 || Step == 2?'lime': themeType.textPrimary}]}/>
                    <Text style={{color:Step == 2?'lime': themeType.textPrimary, fontFamily:'ScienceGothic-Regular'}}>
                        BUILD
                    </Text>
                    <View style={[styles.lineStyle, {borderColor:Step == 2 || Step == 3?'lime': themeType.textPrimary}]}/>
                    <Text style={{color:Step == 3?'lime': themeType.textPrimary, fontFamily:'ScienceGothic-Regular'}}>
                        CREATE
                    </Text>
                    <View style={[styles.lineStyle, {borderColor:Step == 3?'lime': themeType.textPrimary}]}/>
                </View>
                {/* optional numbers */}
                {/* <View className='w-full flex flex-row justify-between items-center '>
                    <Text className='ml-16' style={{color:Step == 1?'lime': themeType.textPrimary, fontFamily:'ScienceGothic-Regular'}}>
                        1
                    </Text>
                    <Text className='ml-2' style={{color:Step == 2?'lime': themeType.textPrimary, fontFamily:'ScienceGothic-Regular'}}>
                        2
                    </Text>
                    
                    <Text className='mr-16' style={{color:Step == 3?'lime': themeType.textPrimary, fontFamily:'ScienceGothic-Regular'}}>
                        3
                    </Text>
                </View> */}
            </View>
        
        
    
            
    
    
    
    
    
        
    
            
        )
    }

   


}

export default StepVisualizer


const styles = StyleSheet.create({
    lineStyle: {
      alignItems:'center',
      borderWidth: 1, // You can use height and background color instead
      margin: 0, // Add some margin around the line
      width: '15%'
    },
  });