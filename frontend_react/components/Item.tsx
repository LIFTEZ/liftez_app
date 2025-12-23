import { useState } from 'react';
import { View,Text,Pressable,Alert,Modal, StyleSheet, ScrollView} from 'react-native';
import { NavigationProp } from '@react-navigation/native'; // For TS typing
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/src/ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from 'expo-linear-gradient';
import log from '@/src/utils/Logger';
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
const[isBtnFocused,setIsBtnFocused] = useState<boolean>(false)
const[isItemFocused,setIsItemFocused] = useState<boolean>(false)
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
          log.info('{66: Item => getKeyValue says} input value:', parsedValue.input);  // Logs just the 'input' value, e.g., 'some value'
        //   Alert.alert(
        //     key,
        //     parsedValue.input,
        //     [
              
        //     ],
        //     { cancelable: true } // Optional: allows dismissing by tapping outside on Android
        //   );
          //display modal
          setIsVisible(true)
          setIsBtnFocused(false)
          setEntryValue(parsedValue.input)
          return parsedValue;
        }
      } catch (error) {
        log.error("{82: Item => getKeyValue says} Error retrieving key", error);
        
      }
}

const navigate = () =>{
    setIsItemFocused(true)
    navigation.navigate('Edit',{storagekey:`entry_${item.itemCount}`})
    setTimeout(()=>{
        setIsItemFocused(false)
    },1000)
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
                    <View className='p-2'>
                    <LinearGradient
                    colors={isItemFocused?['#23f707','#5fc752','#00bc7d']:['#919191', '#737373', '#bfbfbf']}
                    // style={{borderWidth:2, padding:15, borderRadius:10, borderColor:}}
                    style={styles.gradientWrapper}
                    >
                    <View style={styles.innerContent}>

                        <LinearGradient
                        colors={['#404952','#505b66','#657482']}
                        style={styles.gradientWrapper}
                        >
                        <Pressable style={[{display:!isCollapsed? 'flex':'none', borderColor:themeType.textPrimary}]} className='p-2' onPress={()=>(navigate())}>
                            <Text style={{color:themeType.textPrimary2}}>Entry Created On:<Text> {item.date}</Text></Text>
                            <Text className='mt-2' style={{color:themeType.textPrimary2}}>ENTRY STATUS: <Text style={{color:doesEntryExist? 'lime': 'red'}}>{item.entry_status.toUpperCase()}</Text></Text>
                            <View className='flex flex-row items-center justify-between'>
                                <Text className='mt-2 text-xl' style={{color:themeType.textPrimary2}}>DAY: {item.itemCount}</Text>
                                {/* check if entry exists */}
                                {doesEntryExist?
                                (<>
                                <Pressable className='mt-2 border-2 rounded-xl p-2' style={[styles.detailsbutton,{ borderColor:isBtnFocused?'#00bc7d':'transparent'}]} onPressIn={()=>setIsBtnFocused(true)} onPressOut={()=>getKeyValue(EStorageKey)}>
                                <Text style={{color:isBtnFocused?'lime' : themeType.textPrimary2}}>View Details<Entypo name="magnifying-glass" size={14} color={isBtnFocused?'lime' : themeType.textPrimary2} /></Text>
                                </Pressable>
                                </>):null}
                            </View>
                        </Pressable>
                        </LinearGradient>
                    </View>
                    </LinearGradient>
                    </View>
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
                               <View style={[styles.modalView,{backgroundColor:themeType.modal}]} className='w-[95%] h-[85%]  '>
                                    <View className='h-full w-full '>
                                        <View className='w-full bg-emerald-500 flex items-center p-2 rounded-t-lg'>
                                            <Text>DAY: {item.itemCount}, {item.date}</Text>
                                        </View>
                                        <ScrollView className='h-3/4 w-full rounded-b-lg' style={{backgroundColor:themeType.screenBg}}>
                                        <Text className='mt-10' style={[styles.modalText, {color:themeType.textPrimary}]}>{entryValue}</Text>
                                        </ScrollView>
                                    </View>
                                     <Pressable className='mt-4 bg-emerald-500'
                                    style={[styles.button, {transform:isBtnFocused?[{ scale: 1.2 }]: [{scale:1}]}]}
                                    onPress={() => setIsVisible(false)} onPressIn={()=> setIsBtnFocused(true)} onPressOut={()=> setIsBtnFocused(false)}>
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
    detailsbutton: {
        backgroundColor:'rgba(29, 41, 61, 0.5)',
        shadowColor: '#000',
        shadowOffset: {
          width: 2,
          height: 4,
        },
        shadowOpacity: .5,
        shadowRadius: 2,
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
    gradientWrapper: {
        padding: 4, // This defines the border thickness
        borderRadius: 12, // Apply border radius to the gradient
        overflow: 'hidden', // Essential for radius to work correctly
        
      },
      innerContent: {
        flex: 1,
        backgroundColor: '', // Inner background color (make transparent to show gradient)
        borderRadius: 8, // Slightly less than wrapper radius
        padding: 4,
        shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius:2,
      }
   
  });