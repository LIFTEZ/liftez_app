import { useEffect,useState,useRef } from 'react';
import {useNavigation, usePreventRemove} from '@react-navigation/native'
import {Text, Alert, Platform} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types';
import TextArea from '@/components/TextArea';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EditScreenProps = NativeStackScreenProps<RootStackParamList, 'Edit'>;

export default function Edit({navigation, route}: EditScreenProps){


    const {storagekey} = route.params

    const[entryStorageKey, setEntryStorageKey] = useState<string>(storagekey)
    

    // PREVENT LEAVING SCREEN COULD BE USEFUL FOR LATER
    // const hasUnsavedChanges: boolean = true;
    // usePreventRemove(hasUnsavedChanges, ({ data }) => {
    //     if (Platform.OS === 'web') {
    //       const discard = confirm(
    //         'You have unsaved changes. Discard them and leave the screen?'
    //       );
    
    //       if (discard) {
    //         navigation.dispatch(data.action);
    //       }
    //     } else {
    //       Alert.alert(
    //         'Discard changes?',
    //         'You have unsaved changes. Discard them and leave the screen?',
    //         [
    //           { text: "Don't leave", style: 'cancel', onPress: () => {} },
    //           {
    //             text: 'Discard',
    //             style: 'destructive',
    //             onPress: () => navigation.dispatch(data.action),
    //           },
    //         ]
    //       );
    //     }
    //   });

    //DETECT GO BACK FUNCTION FROM DEFAULT HEADER
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', async (e) => {

            console.log('screen removed event:', e)
            //go back is triggered by a POP type action
            if(e.data.action.type === 'POP'){
                console.log('this was triggered by the go back button')
                const keys  = await AsyncStorage.getAllKeys()
                let entryCount:number = 0
                keys.forEach((key, index)=>{
                    console.log(key)
                    //if the storage key from flatlist exists in the asyncstorage then there is an entry with data
                    const keyType = key.split('_')[0]
                    
                    //get last index
                    if(index == keys.length - 1){
                        //no entries exist
                        if(entryCount == 0){
                            console.log('no entries exist pushing empty key to Main')
                            const emptyStorageKey:string = ''
                            navigation.navigate('Main', {entryStorageKey: emptyStorageKey });
                        }
                    }
                    
                    if(keyType == 'entry'){
                        entryCount+=1
                        console.log('entry key found')
                        console.log('storage key:',storagekey)
                        if(key == storagekey && keys.includes(storagekey)){
                            console.log('{Editscreen says} data exists in this entry:', key)
                            navigation.navigate('Main', {entryStorageKey: storagekey });
                        }
                        else if(!keys.includes(storagekey)){
                            console.log('{Editscreen says} old key exists with no data must remove:', storagekey)
                            navigation.navigate('Main', {entryStorageKey: storagekey });
                        }
                        
                    }


                
                   
                    
                })
               
            }
      
        });
      
        return unsubscribe;
      }, [navigation, storagekey]); // Re-run if key changes


    if(route.params)
    console.log('route param exists:', storagekey)
    return(
        // TextArea expects the storageKey prop to be passed to it
        <TextArea STORAGE_KEY={storagekey} ></TextArea>
    )


}