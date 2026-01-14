import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePreventRemove } from '@react-navigation/native';
import { RegimenBuildParamList, RootStackParamList } from '../../src/types';
import { View,Text, StyleSheet, Alert, Animated} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/src/ThemeContext';
import RegimenProvider,{useRegimen} from '@/src/RegimenContext';
import Entypo from '@expo/vector-icons/Entypo';
import log from '@/src/utils/Logger';
import BuilderButton from '@/components/Buttons/BuilderButton';


//get the main stack params to return to main regimens screen
type FullParams = RegimenBuildParamList & RootStackParamList

type RegimenBuildMainScreenProps = NativeStackScreenProps<FullParams, 'RegimenStart'>;


export default function RegimenStartScreen({navigation, route}:RegimenBuildMainScreenProps){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const fadeAnim3 = useRef(new Animated.Value(0)).current;
    const fadeAnim4 = useRef(new Animated.Value(0)).current;
    const fadeAnim5 = useRef(new Animated.Value(0)).current;
    const fadeAnim6 = useRef(new Animated.Value(0)).current;
    const fadeAnim7 = useRef(new Animated.Value(0)).current;

    const{themeType} = useTheme()

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
                onPress: () => {navigation.navigate('RegimenMain')}, // go back to original regimens screen
              },
            ]
          );
        }
      )

    

    const Animation1 = () =>{

        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
          
            log.debug('animation complete')
            await new Promise(resolve => setTimeout(resolve, 500));
            Animation2()
        });
       
    }
    const Animation2 = ()=>{
        Animated.timing(fadeAnim2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            log.debug('animation 2 complete')
            await new Promise(resolve => setTimeout(resolve, 500));
            Animation3()
        });
    }

    const Animation3 = ()=>{
        Animated.timing(fadeAnim3, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            
            log.debug('animation 3 complete')
            await new Promise(resolve => setTimeout(resolve, 500));
            Animation4()
        });
    }
    const Animation4 = ()=>{
        Animated.timing(fadeAnim4, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            
            log.debug('animation 4 complete')
            await new Promise(resolve => setTimeout(resolve, 500));
            Animation5()
        });
    }
    const Animation5 = ()=>{
        Animated.timing(fadeAnim5, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            
            log.debug('animation 5 complete')
            await new Promise(resolve => setTimeout(resolve, 500));
            Animation6()
        });
    }
    const Animation6 = ()=>{
        Animated.timing(fadeAnim6, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            
            log.debug('animation 6 complete')
            await new Promise(resolve => setTimeout(resolve, 500));
            Animation7()
            
        });
    }
    const Animation7 = ()=>{
        Animated.timing(fadeAnim7, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            
            log.debug('all animations complete')
            await new Promise(resolve => setTimeout(resolve, 500));
            
        });
    }

    useEffect(()=>{

        Animation1()
    },[navigation, route.params])


    return(
        <View>
            <RegimenProvider Step={0}>
            {/* <Text style={{color:themeType.textPrimary}}>Regimen Start</Text>
            <Text style={{color:themeType.textPrimary}} onPress={()=> navigation.navigate('RegimenDays', {formData:{days:''}})}>Go to Regimen Days</Text>      */}
                <Animated.View
                    style={{opacity:fadeAnim}}
                >
                <Text style={{color:themeType.textPrimary}} className='text-center mt-8 pt-2 text-xl'>Welcome to Regimen Builder</Text>
                </Animated.View>              
                <Animated.View
                 style={{opacity:fadeAnim2}}
                >
                    <Text style={{color:themeType.textPrimary}} className='text-center mt-4 p-4'>Below are the instructions/steps on how this system works!</Text>
                </Animated.View>
                <Animated.View
                style={{opacity:fadeAnim3}}
                >
                <Text style={{color:themeType.textPrimary}} className='text-left  p-4 text-lg'><Text className='text-xl text-emerald-500'>1.</Text> Select how many days and which muscle groups for each day that you want your regimen to consist of.</Text>
                </Animated.View>
                <Animated.View
                style={{opacity:fadeAnim4}}
                >
                <Text style={{color:themeType.textPrimary}} className='text-left  p-4 text-lg'><Text className='text-xl text-emerald-500'>2.</Text> Build your regimen split per day and muscle group selecting exercises from a large catalog of exercises locked to that specific muscle group.</Text>
                </Animated.View>
                <Animated.View
                style={{opacity:fadeAnim5}}
                >
                <Text style={{color:themeType.textPrimary}} className='text-left  p-4 text-lg'><Text className='text-xl text-emerald-500'>3.</Text> Finalize and create your regimen with an option to email to yourself, someone else, and or multiple people and generate a PDF of it.</Text>
                </Animated.View>
                <Animated.View
                style={{opacity:fadeAnim6}}
                >
                <Text style={{ fontSize:10}} className='text-center mt-2 p-4 text-emerald-500'>*Regimens get saved to your app automatically upon creation and will be displayed in the main Regimens menu*</Text>
                </Animated.View>
                <Animated.View
                style={{opacity:fadeAnim7}}
                >
                <BuilderButton title='Get Started' regimenCount={0} childRoute='RegimenSelect' navigation={navigation}/>
    
                </Animated.View>
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