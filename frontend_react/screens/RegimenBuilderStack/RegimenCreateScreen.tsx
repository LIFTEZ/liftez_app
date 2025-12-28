import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { RegimenBuildParamList } from '../../src/types';
import { View,Text,StyleSheet,Alert } from 'react-native';
import { useTheme } from '@/src/ThemeContext';
import RegimenProvider,{useRegimen} from '@/src/RegimenContext'
import Entypo from '@expo/vector-icons/Entypo';
import log from '@/src/utils/Logger';


type RegimenBuildMainScreenProps = NativeStackScreenProps<RegimenBuildParamList, 'RegimenCreate'>;


export default function RegimenCreateScreen({navigation, route}:RegimenBuildMainScreenProps){

    const{themeType} = useTheme()
    //FormData3 interface is set in types.tsx it extends FormData2 and FormData
    //formData3 is the parameter name expected from the type RegimenBuildParamList
    const{formData3} = route.params

    // just getting visibility of route params
    log.debug('{RegimenCreate received the following form data from RegimenSplit:}',formData3?.Step2?.Step1.days, formData3?.Step2?.Username, formData3?.email)
    
    
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
                onPress: () => {navigation.navigate('RegimenSplit',{formData2:{Step1:{days:''}, Username:''}})}, // Dispatch the original action to proceed
              },
            ]
          );
        }
      )
    return(
        <View>
            <RegimenProvider Step={3}>
            <Text style={{color:themeType.textPrimary}}>Regimen Create</Text>
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