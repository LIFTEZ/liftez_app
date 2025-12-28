import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { RegimenBuildParamList } from '../../src/types';
import { useEffect,useMemo,useState } from 'react';
import { View,Text, StyleSheet,Alert, Pressable} from 'react-native';
import { useTheme } from '@/src/ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import log from '@/src/utils/Logger';
import RegimenProvider,{useRegimen} from '@/src/RegimenContext'
import RadioGroup from 'react-native-radio-buttons-group';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// needed in order to return to RegimenMain from this screen
type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};

type FullParams = RegimenBuildParamList & RootStackParamList


type RegimenBuildMainScreenProps = NativeStackScreenProps<FullParams, 'RegimenDays'>;



export default function RegimenDaysScreen({navigation, route}:RegimenBuildMainScreenProps){

    const{themeType} = useTheme()
     //FormData interface is set in types.tsx
    //formData is the parameter name expected from the type RegimenBuildParamList
    const{formData} = route.params
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [optionReturn, setOptionReturn] = useState<boolean>(false);

    // just getting visibility of route params
    log.debug(formData?.days)
    // im not sure yet what data will need to be passed from RegimenStart, probably no data honestly
    log.debug('{RegimenDays received the following form data from RegimenStart:}',formData?.days)

    usePreventRemove(
        true, // A boolean to control if removal should be prevented
        ({ data }) => {
          // Callback function when removal is prevented
          Alert.alert(
            'Discard changes?',
            'You have unsaved changes. Are you sure to discard them and leave the screen?',
            [
              {
                text: "Stay",
                style: 'cancel',
                onPress: () => {},
              },
              {
                text: 'Discard',
                style: 'destructive',
                onPress: () => {navigation.navigate('RegimenMain')}, // Dispatch the original action to proceed
              },
            ]
          );
        }
      )

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Yes',
            value: 'option1'
        },
        {
            id: '2',
            label: 'No',
            value: 'option2'
        }
    ]), []);

   
    
    // // DISABLE DEFAULT BACK FUNCTION
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
    //         e.preventDefault();
    //         navigation.navigate('RegimenStart')

    //     });
    //     return unsubscribe;
    // },[navigation])

    useEffect(()=>{
        if(selectedId){
        const index = parseInt(selectedId) - 1
        
        log.debug('selected value:',radioButtons[index])
        }

    },[selectedId])


    return(
        <View>
            <RegimenProvider Step={1}>
            
            {/* <Text style={{color:themeType.textPrimary}} onPress={()=> navigation.navigate('RegimenSplit', {formData2:{Step1:{days:'5 days'}, Username:'Jane'}})}>Go to Regimen Split</Text> */}
                {selectedId == undefined?
                <View>
                <View className='mt-10'>
                    <Text style={{color:themeType.textPrimary}}>Would you like to use pre-defined templates for the days and muscle groups?</Text>
                </View>
                
                <RadioGroup 
                containerStyle={{width:'100%', flex:1, justifyContent:'flex-start', alignItems:'flex-start', marginTop:10}}
                labelStyle={[styles.titleText,{color:themeType.textPrimary}]}
                radioButtons={radioButtons} 
                onPress={setSelectedId}
                selectedId={selectedId}
                />
                </View>:
                    <View className='flex w-full justify-center items-center'>
                        {selectedId && radioButtons[parseInt(selectedId) - 1].id == '1'?
                        // PREDEFINED TEMPLATES DROPDOWN
                        <View className='flex flex-row items-center mt-10'>
                            <View style={{width:'20%'}}>
                            <Pressable  className='items-center' onPressIn={()=>{setOptionReturn(true)}} onPressOut={()=>{setOptionReturn(false), setSelectedId(undefined)}}>
                            <MaterialIcons style={{marginRight:10}} name="cancel" size={24} color={optionReturn?'lime': themeType.textPrimary} />
                            </Pressable>
                            </View>
                            <View style={{width:'85%'}} className='flex items-start'>
                            <Text style={{color:themeType.textPrimary,  fontFamily:'ScienceGothic-Regular'}}>PRE-DEFINED-TEMPLATES</Text>
                            </View>
                        </View>
                        :
                        // CHECKBOXES FOR DAYS AND MUSCLE GROUPS
                        <View className='flex flex-row items-center mt-10'>
                            <View style={{width:'25%'}}>
                            <Pressable  className='items-center' onPressIn={()=>{setOptionReturn(true)}} onPressOut={()=>{setOptionReturn(false), setSelectedId(undefined)}}>
                            <MaterialIcons style={{marginRight:10}} name="cancel" size={24} color={optionReturn?'lime': themeType.textPrimary} />
                            </Pressable>
                            </View>
                            <View style={{width:'75%'}} className='flex items-start'>
                            <Text style={{color:themeType.textPrimary, marginLeft:2, fontFamily:'ScienceGothic-Regular'}}>SELECT YOUR DAYS</Text>
                            </View>
                            </View>}
                    </View>
                
                }
                
                
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
    }
    
})