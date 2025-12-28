import {LinearGradient} from 'expo-linear-gradient'
import { useState,useEffect } from 'react';
import {View,Text, Pressable, StyleSheet} from 'react-native'
import { useTheme } from '@/src/ThemeContext';
import { NavigationProp, Route, RouteProp } from '@react-navigation/native';
import log from '@/src/utils/Logger'


type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};

interface FormData{
    days?:string
}

interface FormData2{
    Step1:FormData
    Username:string
}

interface FormData3{
    Step1:FormData
    Step2:FormData2
    email: string
}



type RegimenBuildParamList = {
    RegimenStart:undefined //inital menu that explains how the builder works
    RegimenDays: { formData?: Partial<FormData> };  //select the day split and muscle groups and pass them to the next screen
    RegimenSplit: { formData2?: Partial<FormData2> }; //actually build the split based on the day and muscle groups provided 
    RegimenCreate: { formData3?: Partial<FormData3> }; //create the regimen and store in async, email to someone or self, generate pdf, etc
};

interface BtnProps{
    title:string
    regimenCount?: number
    childRoute?: string
    navigation:NavigationProp<any>
    route?:RouteProp<RootStackParamList, 'RegimenMain'>
    nestedRoute?:RouteProp<RegimenBuildParamList, 'RegimenStart'>
}

const BuilderButton = ({title,regimenCount, childRoute, navigation, route, nestedRoute}: BtnProps) =>{
    const[isFocused, setIsFocused] = useState<boolean>(false)
    const{themeType} = useTheme()
    log.debug(nestedRoute)
    const navigate = () => {

        // if this button is in RegimenMain, check for regimen count
        if(regimenCount == 0 && route?.name == 'RegimenMain'){
            if(route?.name == 'RegimenMain'){
                navigation.navigate('RegimenBuildMain')
            }
            else{
                //PARAMS DO NOT MATTER HERE AND THE SCREEN CAN BE FIXED SINCE REGIMENCOUNT == 0 indicates RegimenStart will always be the first screen
                navigation.navigate('RegimenBuildMain',
                    {
                        screen:'RegimenDays',
                        params:{formData:{days:'5'}}
                    }   
                )
            }
           
        }
        // else regimen count and route doesn't matter go to the passed child route
        else{
            //THE PARAMS WILL MATTER THO IM GOING TO HAVE TO UPDATE THAT IN THE FUTURE
            navigation.navigate('RegimenBuildMain',
                {
                    screen:childRoute,
                    params:{formData:{days:'5'}}
                }
            )
        }

    }
    

    return(
        <LinearGradient
        colors={isFocused?['#23f707','#5fc752','#00bc7d']:['#919191', '#737373', '#bfbfbf']}
        // style={{borderWidth:2, padding:15, borderRadius:10, borderColor:}}
        style={styles.gradientWrapper}
        >
            <View style={styles.innerContent}>
                {/* inner gradient */}
                <LinearGradient
                    colors={['#4d4d4d','#363535','#232323']}
                    style={styles.gradientWrapper}
                    >       
                {/* Navigate to RegimenBuildMain which contains the routes RegimenStart, RegimenDays, RegimenSplit, RegimenCreate */}
                <Pressable onPressIn={()=> setIsFocused(true)} onPressOut={()=> {setIsFocused(false), navigate()}}>
                    <Text style={{color:isFocused? 'lime':themeType.textPrimary,fontFamily:'ScienceGothic-Regular'}} className='text-center text-xl p-2 uppercase'>{title}</Text>
                </Pressable>
                {/* <Text style={{color:themeType.textPrimary}} className='mt-10' onPress={()=> navigation.navigate('RegimenBuildMain')}> Go to Regimen Builder</Text> */}
                </LinearGradient>
            </View>
        </LinearGradient>
    )


}
export default BuilderButton

const styles = StyleSheet.create({


    gradientWrapper: {
        padding: 1, // This defines the border thickness
        borderRadius: 12, // Apply border radius to the gradient
        overflow: 'hidden', // Essential for radius to work correctly
        
      },
      innerContent: {
        
        backgroundColor: '', // Inner background color (make transparent to show gradient)
        borderRadius: 8, // Slightly less than wrapper radius
        padding: 4,
        shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius:2,
      },
})