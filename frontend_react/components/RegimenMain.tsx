import { useState,useEffect } from 'react';
import {View,Text, Pressable, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from '@/src/utils/Logger';
import { useTheme } from '@/src/ThemeContext';
import { NavigationProp, Route, RouteProp } from '@react-navigation/native';
import BuilderButton from './Buttons/BuilderButton';


type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};


interface RouteProps{
    navigation:NavigationProp<any>
    route:RouteProp<RootStackParamList, 'RegimenMain'>
}



const RegimenMain = ({navigation, route }: RouteProps) =>{

    const{themeType} = useTheme()

   
    const[RegimenCount, setRegimenCount] = useState<number>(0) //set to 1 for faster debugging and developing purposes
    
    const getRegimens = async(key:string)=>{

        const jsonvalue = await AsyncStorage.getItem(key)

        log.debug(jsonvalue)
    }

    
    const getTotalRegimens = async () =>{

            //get all regimen keys
            const keys = await AsyncStorage.getAllKeys()
            let count:number = 0
            for(const key of keys){

                if(key.includes('Regimen_')){
                    count+=1
                    getRegimens(key)
                    //also call another function
                }
            }


            setRegimenCount(count)

    }

    useEffect(()=>{

       getTotalRegimens()

    })

    //useLayoutEffect to add bottom tabbar back after regimen was created

    return(

        <View>
            {RegimenCount == 0?
                <View className='w-full flex justify-center items-center'>
                    <Text style={{color:themeType.textPrimary}}>No Regimens found*</Text>
                    <Text style={{color:themeType.textPrimary}} className='mt-10 p-2'>*Click the button below to build your first regimen!</Text>
                </View>
            // display the regimens in a flatlist and render its own component because it will need different functionalities
            // render component will be editable and downloadable (convert to pdf) and also can email from here as well
            : <View>
                <Text className='text-emerald-500'>
                    TOTAL REGIMENS: {RegimenCount}
                </Text>
                
                </View>}


       
                {/* this fixed height is gonna change once flatlist is added with its own fixed height */}
            <View className='flex w-full justify-end' style={{height:RegimenCount == 0? '75%': '85%'}}>
                <BuilderButton title='Build Regimen' regimenCount={RegimenCount} childRoute='RegimenSelect' navigation={navigation} route={route}/>
            </View>
        
        </View>
    


    )

}

export default RegimenMain



