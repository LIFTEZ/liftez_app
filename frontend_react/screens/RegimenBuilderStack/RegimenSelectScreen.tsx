import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { RegimenBuildParamList } from '../../src/types';
import { useEffect,useMemo,useState } from 'react';
import { View,Text, StyleSheet,Alert, Pressable} from 'react-native';
import { useTheme } from '@/src/ThemeContext';
import log from '@/src/utils/Logger';
import RegimenProvider,{useRegimen} from '@/src/RegimenContext'

import RegimenSelect from '../../components/RegimenBuilder/RegimenSelect';

// needed in order to return to RegimenMain from this screen
type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};

type FullParams = RegimenBuildParamList & RootStackParamList


type RegimenBuildMainScreenProps = NativeStackScreenProps<FullParams, 'RegimenSelect'>;



export default function RegimenSelectScreen({navigation, route}:RegimenBuildMainScreenProps){

    const{themeType} = useTheme()
     //FormData interface is set in types.tsx
    //formData is the parameter name expected from the type RegimenBuildParamList
    //const{formData} = route.params
    // just getting visibility of route params
    //log.debug(formData?.days)
    // im not sure yet what data will need to be passed from RegimenStart, probably no data honestly
    //log.debug('{RegimenDays received the following form data from RegimenStart:}',formData?.days)

    
    usePreventRemove(
        true,
        ({ data }) => {
            
            navigation.navigate('RegimenMain')
            
        }

    )
    
    
    // usePreventRemove(
    //     true, // A boolean to control if removal should be prevented
    //     ({ data }) => {
    //     // Callback function when removal is prevented
    //     Alert.alert(
    //         'Discard changes?',
    //         'You have unsaved changes. Are you sure to discard them and leave the screen?',
    //         [
    //         {
    //             text: "Stay",
    //             style: 'cancel',
    //             onPress: () => {},
    //         },
    //         {
    //             text: 'Discard',
    //             style: 'destructive',
    //             onPress: () => {navigation.navigate('RegimenMain')}, // Dispatch the original action to proceed
    //         },
    //         ]
    //     );
    //     }
    // )



    return(
        <View>
            <RegimenProvider Step={1}>
            
                <RegimenSelect navigation={navigation} route={route}/>
                
            </RegimenProvider>
        </View>
    )
}

const styles = StyleSheet.create({

    container:{
        //backgroundColor:'rgba(3, 252, 20, 1)',
        padding:10
    },
    titleText:{
        textAlign:'center',
        fontSize:12,
        fontFamily:'ScienceGothic-Regular'
    },
    
})