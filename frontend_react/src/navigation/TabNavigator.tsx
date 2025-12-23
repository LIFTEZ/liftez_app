import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MealsNavigator from './MealsNavigator';
import RegimensNavigator from './RegimensNavigator';
import { useTheme } from '../ThemeContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';

const Tab = createBottomTabNavigator();



export default function TabNavigator(){
const {theme, themeType, ToggleTheme } = useTheme();
    
    return(
        

        <Tab.Navigator initialRouteName='Meals' screenOptions={{
                    // paddingHorizontal:<number> if I want the tab options closer to each other
                tabBarStyle: { position: 'absolute', height:60, backgroundColor:themeType.headerBg, borderTopColor:'transparent'},
                tabBarActiveTintColor:'#00bc7d',
                tabBarIconStyle:{marginTop:10},
                tabBarLabelStyle:{fontFamily:'ScienceGothic-Regular', fontSize:12, textTransform:'uppercase', width:100,height:30}
        }}>
                <Tab.Screen name="Meals" component={MealsNavigator} options={{
                    headerShown:false,
                    tabBarIcon:function () {return <FontAwesome5 name="utensils" size={24} color={themeType.textPrimary} />},
                }} />
                <Tab.Screen name="Regimens" component={RegimensNavigator} options={{
                    headerShown:false,
                    tabBarIcon:function () {return <Entypo name="tools" size={24} color={themeType.textPrimary} />}
                }}/>

        </Tab.Navigator>
    
    
    
    )


    



}