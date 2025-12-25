import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useState, useEffect} from 'react'
import { RootStackParamList } from '../types';
import Main from '../../screens/MainScreen';
import Edit from '../../screens/EditScreen'
import {Button,Pressable,StyleSheet,Text,TouchableOpacity,View} from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LoggingNavigator() {
//theme context
const {theme, themeType, ToggleTheme } = useTheme();

  return (
    
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{
            headerLeft:() => (
                <View className='flex'>
                   <Pressable style={styles.themeButton} onPressOut={()=>ToggleTheme()}>
                    {theme == 'light'?
                      <MaterialIcons className='mb-2' name="light-mode" size={32} color="#f0c51a" />
                      :<MaterialIcons className='mb-2' name="dark-mode" size={32} color="#ebeadd" />
                    }
                   </Pressable>
                </View>
              ),
            title:'',
            headerStyle:{backgroundColor:themeType.headerBg},
            headerTintColor:'#00bc7d'
        }}/>
        <Stack.Screen name="Edit" component={Edit}  options={{
            headerBackTitle:'Back',
            title:'',
            headerStyle:{backgroundColor:themeType.headerBg},
            headerTintColor:'#00bc7d'
        }}/>
      </Stack.Navigator>
    
  );
}

const styles = StyleSheet.create({

    themeButton:{
        
        
        padding:4
    }

})