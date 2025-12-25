import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoggingNavigator from './LoggingNavigator';
import RegimensNavigator from './RegimensNavigator';
import { useTheme } from '../ThemeContext';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
const Tab = createBottomTabNavigator();



export default function TabNavigator(){
const {theme, themeType, ToggleTheme } = useTheme();
    
    return(
        

        <Tab.Navigator initialRouteName='Logging' screenOptions={{
                    // paddingHorizontal:<number> if I want the tab options closer to each other
                tabBarStyle: { position: 'absolute', height:60, backgroundColor:themeType.headerBg, borderTopColor:'transparent'},
                tabBarActiveTintColor:'#00bc7d',
                tabBarIconStyle:{marginTop:10},
                tabBarLabelStyle:{fontFamily:'ScienceGothic-Regular', fontSize:12, textTransform:'uppercase', width:100,height:30}
        }}>
                <Tab.Screen name="Logging" component={LoggingNavigator} options={{
                    headerShown:false,
                    tabBarIcon:function () {return <Octicons name="log" size={24} color={themeType.textPrimary} />},
                }} />
                <Tab.Screen name="Regimens" component={RegimensNavigator} options={{
                    headerShown:false,
                    tabBarIcon:function () {return <FontAwesome5 name="dumbbell" size={24} color={themeType.textPrimary} />}
                }}/>

        </Tab.Navigator>
    
    
    
    )


    



}