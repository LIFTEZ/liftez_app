import { useTheme } from '../ThemeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegimenBuildParamList, RootStackParamList } from '../types';
import RegimenStartScreen from '../../screens/RegimenBuilderStack/RegimenStartScreen'
import RegimenDaysScreen from '../../screens/RegimenBuilderStack/RegimenDaysScreen'
import RegimenSplitScreen from '../../screens/RegimenBuilderStack/RegimenSplitScreen'
import RegimenCreateScreen from '../../screens/RegimenBuilderStack/RegimenCreateScreen'


const Stack = createNativeStackNavigator<RegimenBuildParamList>();

export default function RegimenBuildStack(){

//theme context
const {theme, themeType, ToggleTheme } = useTheme();


    return(
        <Stack.Navigator initialRouteName="RegimenStart" screenOptions={{
            headerShown:false,
            headerBackButtonMenuEnabled:false, //prevent back button from going back multiple screens
           
        }}>
            <Stack.Screen name="RegimenStart" component={RegimenStartScreen}
            options={{
                title:'',
                headerStyle:{backgroundColor:themeType.headerBg},
                headerTintColor:'#00bc7d',
                headerBackTitle:'Regimens'
            }}/>
            <Stack.Screen name="RegimenDays" component={RegimenDaysScreen}
            options={{
                title:'',
                headerStyle:{backgroundColor:themeType.headerBg},
                headerTintColor:'#00bc7d',
                headerBackTitle:'Start'
            }}/>
            <Stack.Screen name="RegimenSplit" component={RegimenSplitScreen}
            options={{
                title:'',
                headerStyle:{backgroundColor:themeType.headerBg},
                headerTintColor:'#00bc7d'
            }}/>
            <Stack.Screen name="RegimenCreate" component={RegimenCreateScreen}
            options={{
                title:'',
                headerStyle:{backgroundColor:themeType.headerBg},
                headerTintColor:'#00bc7d'
            }}/>

        </Stack.Navigator>

    )
}