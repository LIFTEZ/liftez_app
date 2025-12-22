import { useState } from 'react';
import { View,Text,Pressable,Alert,Modal, StyleSheet, ScrollView} from 'react-native';
import { NavigationProp } from '@react-navigation/native'; // For TS typing
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/src/ThemeContext';
// required in order to pass the entire item from the renderItem
interface NoteData {
    id: string;
    itemCount: number;
    date?: string;
    entry_status?: string;
}

  interface renderItemProps{
    item:NoteData
    EntryStorageKeys:string[]
    navigation:NavigationProp<any>
    
}


export default function ItemComponent({item, EntryStorageKeys, navigation}: renderItemProps){


// animation/status variables
const[isFocused,setIsFocused] = useState<boolean>(false)
const[isVisible,setIsVisible] = useState<boolean>(false)
const[entryValue, setEntryValue] = useState<string>('')

// archiving variables
const archiveItemLimit = 30
const[isCollapsed, setIsCollapsed] = useState<boolean>(false)
const[archiveCount, setArchiveCount] = useState<number>(0)

//theme context
const{theme, themeType} = useTheme()

interface AsyncKeyValues{
    input: string
}



const toggleCollapse = () =>{

    if(isCollapsed){
        setIsCollapsed(false)
    }
    else{
        setIsCollapsed(true)
    }
}


const getKeyValue = async (key:string)  => {

    try {
       
        const jsonValue = await AsyncStorage.getItem(key);
        // Parse the JSON string back into a User object, or return null if no value
        if (jsonValue != null) {
          const parsedValue = JSON.parse(jsonValue) as AsyncKeyValues;
          console.log('input value:', parsedValue.input);  // Logs just the 'input' value, e.g., 'some value'
        //   Alert.alert(
        //     key,
        //     parsedValue.input,
        //     [
              
        //     ],
        //     { cancelable: true } // Optional: allows dismissing by tapping outside on Android
        //   );
          //display modal
          setIsVisible(true)
          setIsFocused(false)
          setEntryValue(parsedValue.input)
          return parsedValue;
        }
      } catch (error) {
        console.error("{EntryList} Error retrieving key", error);
        
      }
}




let doesEntryExist:boolean = false
let EStorageKey:string = ''

EntryStorageKeys.forEach((key) => {
    
    const indexToMatch = key.split('_')[1] //get the index of the entry key

    if(parseInt(indexToMatch) == item.itemCount){
      doesEntryExist = true
      EStorageKey = key
      return
    }
})

item.entry_status = doesEntryExist.toString() //convert boolean to string

    return(

        <View>
        {item.itemCount == archiveItemLimit + 1?(<>
        <Text onPress={()=>toggleCollapse()}>PAST 30 DAYS ARCHIVED {archiveCount}</Text>
        </>):null}
        
        {/* See if item count divided by 30 gives no remainder */}
        {item.itemCount <= archiveItemLimit? (<>
                    <Pressable style={{display:!isCollapsed? 'flex':'none', borderColor:themeType.textPrimary}} className='p-4 border-2 rounded-lg w-full mb-2'  onPress={()=>{navigation.navigate('Edit',{storagekey:`entry_${item.itemCount}`})}}>
                    <Text style={{color:themeType.textPrimary}}>Entry Created On:<Text> {item.date}</Text></Text>
                    <Text className='mt-2' style={{color:themeType.textPrimary}}>ENTRY STATUS: <Text style={{color:doesEntryExist? 'green': 'red'}}>{item.entry_status.toUpperCase()}</Text></Text>
                    <View className='flex flex-row items-center justify-between'>
                    <Text className='mt-2 text-xl' style={{color:themeType.textPrimary}}>DAY: {item.itemCount}</Text>
                    {/* check if entry exists */}
                    {doesEntryExist?
                    (<>
                    <Pressable className='mt-2 border-2 rounded-xl p-2' style={{ borderColor:isFocused?'green':themeType.textPrimary}} onPressIn={()=>setIsFocused(true)} onPressOut={()=>getKeyValue(EStorageKey)}>
                    <Text style={{color:isFocused?'green' : themeType.textPrimary}}>View Details</Text>
                    </Pressable>
                    </>):null}
                    </View>
                    </Pressable>
                    
                    {/* DISPLAY MODAL ONLY IF ENTRY EXISTS */}
                    {doesEntryExist?
                           <Modal 
                           animationType="fade"
                           visible={isVisible}
                           transparent={true}
                           onRequestClose={() => {
                               Alert.alert('Modal has been closed.');
                               setIsVisible(false)
                           }}>
                           <View style={styles.centeredView}>
                               <View style={styles.modalView} className='w-[95%] h-[85%] bg-slate-500/75 '>
                                    <View className='h-full w-full '>
                                        <View className='w-full bg-emerald-500 flex items-center p-2 rounded-t-lg'>
                                            <Text>DAY: {item.itemCount}, {item.date}</Text>
                                        </View>
                                        <ScrollView className='h-3/4 w-full rounded-b-lg' style={{backgroundColor:themeType.screenBg}}>
                                        <Text className='mt-10' style={[styles.modalText, {color:themeType.textPrimary}]}>{entryValue}</Text>
                                        </ScrollView>
                                    </View>
                                     <Pressable className='mt-4 bg-emerald-500'
                                    style={[styles.button, {transform:isFocused?[{ scale: 1.2 }]: [{scale:1}]}]}
                                    onPress={() => setIsVisible(false)} onPressIn={()=> setIsFocused(true)} onPressOut={()=> setIsFocused(false)}>
                                    <Text style={styles.textStyle}>Close</Text>
                                </Pressable>
                                <View className='-mt-4'>
                               
                                </View>
                               </View>
                           </View>
                       </Modal>
                    :null
                    }
            
        
        </>):<Pressable  className='p-4 border-2 rounded-lg w-full mb-2'  onPress={()=>{navigation.navigate('Edit',{storagekey:`entry_${item.itemCount}`})}}>
                    <Text>Entry Created On:<Text> {item.date}</Text></Text>
                    <Text className='mt-2 text-xl'>DAY: {item.itemCount}</Text>
                    </Pressable>
           


        }
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'rgba(255,255,255,.5)'
    },
    modalView: {
      margin: 20,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
   
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    modalText: {
      marginBottom: 15,
      marginLeft:10,
    },
  });