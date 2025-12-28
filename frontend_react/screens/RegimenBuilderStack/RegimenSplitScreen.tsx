import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { RegimenBuildParamList } from '../../src/types';
import { View,Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/src/ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import log from '@/src/utils/Logger';
import RegimenProvider,{useRegimen} from '@/src/RegimenContext';

type RegimenBuildMainScreenProps = NativeStackScreenProps<RegimenBuildParamList, 'RegimenSplit'>;


export default function RegimenSplitScreen({navigation, route}:RegimenBuildMainScreenProps){
    
    const{themeType} = useTheme()
     //FormData2 interface is set in types.tsx it extends FormData
    //formData2 is the parameter name expected from the type RegimenBuildParamList
    const{formData2} = route.params

    // just getting visibility of route params
    log.debug(formData2?.Step1?.days)
    log.debug('{RegimenSplit received the following form data from RegimenDays:}',formData2?.Step1?.days, formData2?.Username)

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
                onPress: () => {navigation.navigate('RegimenDays',{formData:{days:''}})}, // Dispatch the original action to proceed
              },
            ]
          );
        }
      )

    return(
        <View>
            <RegimenProvider Step={2}>
            <Text style={{color:themeType.textPrimary}}>Regimen Split</Text>
            <Text style={{color:themeType.textPrimary}} onPress={()=> navigation.navigate('RegimenCreate', {formData3:{Step2:{Step1:{days:'15'}, Username:'Jane'}, email:'stuff@gmail.com' }})}>Go to Regimen Create</Text>
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