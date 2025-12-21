import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Main from '../../screens/MainScreen';
import Edit from '../../screens/EditScreen'
import {Button,Text,TouchableOpacity} from 'react-native'

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{
            title:''
        }}/>
        <Stack.Screen name="Edit" component={Edit}  options={{
            headerBackTitle:'Back',
            title:''
        }}/>
      </Stack.Navigator>
    
  );
}