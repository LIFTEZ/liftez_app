import {LinearGradient} from 'expo-linear-gradient'
import { useState,useEffect } from 'react';
import {View,Text, Pressable, StyleSheet} from 'react-native'
import { useTheme } from '@/src/ThemeContext';
import { NavigationProp, Route, RouteProp,useRoute } from '@react-navigation/native';
import { CreateParams } from '@/src/types';
import { RegimenBuildParamList, RootStackParamList } from '@/src/types';
import log from '@/src/utils/Logger'

// interface FormData{
//     days?:string
// }

// interface FormData2{
//     Step1:FormData
//     Username:string
// }

// interface FormData3{
//     Step1:FormData
//     Step2:FormData2
//     email: string
// }

interface FormData{
    days:string[]
    muscles:string[]
}

interface FormData2{
    Step2:FormData
    email: string
}


//SELECT PARAMS TO BUILD
interface ParamsData{
    days:string[]
    muscles:string[]
}



//BUILD PARAMS TO CREATE


interface BtnProps{
    title:string
    params?:ParamsData | null
    buildParams?:CreateParams
    regimenCount?: number
    childRoute?: string
    navigation:NavigationProp<any>
    route?:RouteProp<RootStackParamList, 'RegimenMain'>
}

const BuilderButton = ({title,params, buildParams, regimenCount, childRoute, navigation, route}: BtnProps) =>{
    const[isFocused, setIsFocused] = useState<boolean>(false)
    const{themeType} = useTheme()
    const curroute = useRoute<RouteProp<RegimenBuildParamList>>();

  // Access dynamically (e.g., log or use params)
    log.warn('Current route name:', curroute.name); // e.g., 'RegimenStart
    if(params)
    log.debug('params received:',params)

    if(buildParams){

    }
    //log.debug('{BuilderButton}: build params received from RegimenBuild to pass to CreateRegimen: ', buildParams)

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
                        screen:'RegimenSelect',
                        params:{formData:{days:'5'}}
                    }   
                )
            }
           
        }
        // else regimen count and route doesn't matter go to the passed child route
        else{
            
            //CONDITIONAL FOR CREATECOMPLETION ON REGIMENCREATE TO RETURN TO EXIT REGIMEN BUILDER
            if(childRoute == "RegimenMain"){
                log.warn('this is true, navigate to regimen main')
                navigation?.getParent()?.navigate('RegimenMain')
            }
            else{

                //THE PARAMS WILL MATTER THO IM GOING TO HAVE TO UPDATE THAT IN THE FUTURE
                navigation.navigate('RegimenBuildMain',
                    {
                        screen:childRoute,
                        params:{formData:buildParams? buildParams :params}
                    }
                )
            }
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
                    <Text style={{color:isFocused? 'lime':themeType.textPrimary2,fontFamily:'ScienceGothic-Regular'}} className='text-center text-xl p-2 uppercase'>{title}</Text>
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