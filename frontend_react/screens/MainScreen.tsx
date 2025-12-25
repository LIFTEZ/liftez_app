import { useEffect,useState,useRef,useCallback} from 'react';
import {Text, View, StyleSheet} from 'react-native'
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/src/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types';
import EntryFlatlist from '@/components/EntryFlatlist';
import log from '@/src/utils/Logger';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5.js';
type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;


export default function Main({navigation, route}: MainScreenProps){
    //theme context
    const{themeType} = useTheme()

    const[eStorageKey, setEntryStorageKey] = useState<string>('')


    //check if returned from EditScreen
    if(route.params){
        const{entryStorageKey} = route.params
        log.info(route.params)
        log.info('{25: MainScreen says} key passed from EditScreen from TextArea:', entryStorageKey)
        return(
       
            <View className='h-full w-full' style={[styles.container, {backgroundColor: themeType.screenBg}]}>
                <View className='p-4'>
                <Text style={[styles.titleText,{color:'#00bc7d'}]}> MEAL LOGGING <FontAwesome5 name="utensils" size={24} color={themeType.textPrimary} /></Text>
                </View>
               <EntryFlatlist navigation={navigation} route={route} EntryStorageKey={entryStorageKey}/>
    
              
            </View>
        )
    }
    //else its a empty fresh app open or reload
    else{
        return(
       
            <View className='h-full w-full' style={[styles.container, {backgroundColor: themeType.screenBg}]}>
                <View className='p-4'>
                <Text style={[styles.titleText,{color:'#00bc7d'}]}>MEAL LOGGING <FontAwesome5 name="utensils" size={24} color={themeType.textPrimary} /></Text>
                </View>
               <EntryFlatlist navigation={navigation} route={route} />
    
              
            </View>
        )
    }
    
    

    // useFocusEffect(
    //     useCallback(() => {
    //       const loadTempKey = async () => {
    //         try {
    //           const tempKey = await AsyncStorage.getItem('tempStorageKey');
    //           if (tempKey) {
    //             log.info('{Main/EntryFlatlist says} storage key from TextArea:', tempKey);
    //             // Use the key here (e.g., update state, check existence, reload list)
    //             await AsyncStorage.removeItem('tempStorageKey'); // Clear after use
    //           }
    //         } catch (error) {
    //           console.error('Temp load error:', error);
    //         }
    //       };
    //       loadTempKey();
    //     }, [])
    //   );



   

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