import { useEffect,useState,useRef,useCallback} from 'react';
import {Text, View, StyleSheet} from 'react-native'
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import { useTheme } from '@/src/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types';
import Entypo from '@expo/vector-icons/Entypo'; 
import FontAwesome5 from '@expo/vector-icons/FontAwesome5.js'
import log from '@/src/utils/Logger';

type RegimensScreenProps = NativeStackScreenProps<RootStackParamList, 'RegimenMain'>;


export default function RegimensScreen({navigation, route}: RegimensScreenProps){
    //theme context
    const{themeType} = useTheme()

    return(
    
        <View className='h-full w-full' style={[styles.container, {backgroundColor: themeType.screenBg}]}>
            <View className='p-4'>
            <Text style={[styles.titleText,{color:'#00bc7d'}]}><FontAwesome5 name="dumbbell" size={24} color={themeType.textPrimary} />  REGIMENS  <FontAwesome5 name="dumbbell" size={24} color={themeType.textPrimary} /> </Text>
            {/* <Text style={[styles.titleText,{color:'#00bc7d'}]}><Entypo name="tools" size={24} color={themeType.textPrimary} /> REGIMEN BUILDER <Entypo name="tools" size={24} color={themeType.textPrimary} /></Text> */}
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