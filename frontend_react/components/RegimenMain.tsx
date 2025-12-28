import { useState,useEffect } from 'react';
import {View,Text, Pressable, StyleSheet} from 'react-native'
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

   
    const[RegimenCount, setRegimenCount] = useState<number>(1) //set to 1 for faster debugging and developing purposes
    
    
    return(

        <View>
            {RegimenCount == 0?
                <View className='w-full flex justify-center items-center'>
                    <Text style={{color:themeType.textPrimary}}>No Regimens found*</Text>
                    <Text style={{color:themeType.textPrimary}} className='mt-10 p-2'>*Click the button below to build your first regimen!</Text>
                </View>
            // display the regimens in a flatlist
            : null}


       
                {/* this fixed height is gonna change once flatlist is added with its own fixed height */}
            <View className='flex w-full justify-end' style={{height:RegimenCount == 0? '75%': '85%'}}>
                <BuilderButton title='Build Regimen' regimenCount={RegimenCount} childRoute='RegimenDays' navigation={navigation} route={route}/>
            </View>
        
        </View>
    


    )

}

export default RegimenMain



