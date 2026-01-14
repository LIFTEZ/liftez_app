import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { RegimenBuildParamList,RootStackParamList } from '../../src/types';
import { View,Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/src/ThemeContext';
import log from '@/src/utils/Logger';
import RegimenProvider,{useRegimen} from '@/src/RegimenContext';
import RegimenBuild from '@/components/RegimenBuilder/RegimenBuild';


type FullParams = RegimenBuildParamList & RootStackParamList


type RegimenBuildMainScreenProps = NativeStackScreenProps<FullParams, 'RegimenBuild'>;


export default function RegimenBuildScreen({navigation, route}:RegimenBuildMainScreenProps){
    
    const{themeType} = useTheme()
     //FormData2 interface is set in types.tsx it extends FormData
    //formData2 is the parameter name expected from the type RegimenBuildParamList
    const{formData} = route.params
    log.warn(route)
    if(formData?.prevRoute){
      log.info('form data from RegimenCreate (Back Button navigation):', formData)
    }
    else{
    log.info('form data from RegimenSelect (BuilderButton navigation):', formData)
    log.debug('{RegimenBuild received the following form data from RegimenSelect:}',formData?.days, formData?.muscles)
    }

   
    usePreventRemove(
        true, // A boolean to control if removal should be prevented
        ({ data }) => {
          // Callback function when removal is prevented
          Alert.alert(
            'Return to Select?',
            'If you leave this screen you will have to re-select your days, muscles, and or template. Are you sure you want to start over?',
            [
              {
                text: "Stay",
                style: 'cancel',
                onPress: () => {},
              },
              {
                text: 'Yes',
                style: 'destructive',
                onPress: () => {navigation.navigate('RegimenSelect')}, // Dispatch the original action to proceed
              },
            ]
          );
        }
      )

    return(
        <View>
            <RegimenProvider Step={2}>
              {formData.prevRoute?
                <RegimenBuild params={{days:formData?.days, muscles:formData?.muscles, prevRouteParams:formData?.prevRouteParams, prevRoute:formData?.prevRoute}} navigation={navigation} route={route}/>
            
              :<RegimenBuild params={{days:formData?.days, muscles:formData?.muscles}} navigation={navigation} route={route}/>}
              

            {/* <Text style={{color:themeType.textPrimary}}>Regimen Build</Text>
            <Text style={{color:themeType.textPrimary}} onPress={()=> navigation.navigate('RegimenCreate', {formData2:{Step2:{days:['15'], muscles:['arms,chest']}, email:'stuff@gmail.com' }})}>Go to Regimen Create</Text> */}
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
        fontSize:24,
        fontFamily:'ScienceGothic-Regular'
    }

})