import { useEffect,useState,useRef,useCallback} from 'react';
import {Text, View, StyleSheet} from 'react-native'
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/src/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types';
import EntryFlatlist from '@/components/EntryFlatlist';
import log from '@/src/utils/Logger';

type RegimensScreenProps = NativeStackScreenProps<RootStackParamList, 'Regimens'>;


export default function Regimens({navigation, route}: RegimensScreenProps){
    //theme context
    const{themeType} = useTheme()

    return(
    
        <View className='h-full w-full' style={[styles.container, {backgroundColor: themeType.screenBg}]}>
            <View className='p-4'>
            <Text style={[styles.titleText,{color:'#00bc7d'}]}>JP REGIMEN BUILDER</Text>
            </View>
            

            
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
        fontSize:24,
        fontFamily:'ScienceGothic-Regular'
    }

})