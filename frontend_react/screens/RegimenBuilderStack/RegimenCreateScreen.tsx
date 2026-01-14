import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { CreateParams, RegimenBuildParamList, RootStackParamList } from '../../src/types';
import { View,Text,StyleSheet,Alert, ScrollView } from 'react-native';
import { useTheme } from '@/src/ThemeContext';
import RegimenProvider,{useRegimen} from '@/src/RegimenContext'
import Entypo from '@expo/vector-icons/Entypo';
import log from '@/src/utils/Logger';
import { fromPairs } from 'lodash';
import RegimenCreate from '@/components/RegimenBuilder/RegimenCreate';


type FullParams = RegimenBuildParamList & RootStackParamList


type RegimenBuildMainScreenProps = NativeStackScreenProps<FullParams, 'RegimenCreate'>;


export default function RegimenCreateScreen({navigation, route}:RegimenBuildMainScreenProps){

    const{themeType} = useTheme()
    //FormData3 interface is set in types.tsx it extends FormData2 and FormData
    //formData3 is the parameter name expected from the type RegimenBuildParamList
    const{formData} = route.params
    log.debug(route.params)
    // just getting visibility of route params
    log.debug('{RegimenCreate received the following form data from RegimenBuild:}',formData)
    
    const regimenData = formData as CreateParams

    
    
    usePreventRemove(
        true, // A boolean to control if removal should be prevented
        ({ data }) => {
          // Callback function when removal is prevented
          Alert.alert(
            'Return to Build?',
            'You can return to the Build step and keep your current regimen build, but anything you did in Create will not be saved!',
            [
              {
                text: "Stay",
                style: 'cancel',
                onPress: () => {},
              },
              {
                text: 'OK',
                style: 'destructive',
                onPress: () => {navigation.navigate('RegimenBuild',{formData:{prevRouteParams:formData as CreateParams,prevRoute:'RegimenCreate'}})}, // Dispatch the original action to proceed
              },
            ]
          );
        }
      )
    return(
        <View>
            <RegimenProvider Step={3}>
            
                <RegimenCreate formData={regimenData} navigation={navigation} route={route}/>
              
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