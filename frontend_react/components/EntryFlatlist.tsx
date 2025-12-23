import { useEffect, useState,useRef, use } from 'react';
import {Text, View, Pressable,Button, Alert, FlatList, StyleSheet} from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '@/src/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ItemComponent from './Item';
import { useTheme } from '@/src/ThemeContext';
import {LinearGradient} from 'expo-linear-gradient'
import log from '@/src/utils/Logger';



//required to get access to navigation defines the parameters expected to pass from the parent component which is MainScreen.tsx
type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

interface ParentProps {
    EntryStorageKey?: string  
}

type EntryFlatlistProps = MainScreenProps & ParentProps;

export default function EntryFlatlist({navigation, route, EntryStorageKey}: EntryFlatlistProps){

//theme context
const{theme, themeType} = useTheme()
    log.info('{26: EntryFlatList says} STORAGE KEY:', EntryStorageKey)
    
/**
 *
 * 
 * Issues: 
 * - Keyboard on dismisal still clips the text, not a huge issue but something I'd like to fix if i can
 * RESOLVED - TextArea scroll to bottom on entry open does not work as it should, it shouldnt be focused on open anyways
 * RESOLVED - for some reason the entry status only updates if I move to another entry then go back to the previous entry that I tried updating,
 *   this means there is a entry length or existing problem that prevents a single entry from acquiring its correct status 
 *          - Issue was the useEffect didn't have the correct dependency required for rerender which was route.params
 *
 * CURRENTLY WORKING ON:
 * 
 * 
 * TOMORROW MORNING:
 * - implement archiving ****
 * - start working on Regimen Builder following the ideas in my note in Notes App
 * 
 * 
 * COMPLETED - continue adding line number and function name to log {26: EntryFlatList says => <function name>}
 * COMPLETED - checkout react native logs and see if I can replace log.infos with that
 * COMPLETED - commit stylistic changes and bug fixes
 * COMPLETED - create new branch for archival feature
 * 
 * 
 * 
 * COMPLETED (for the most part) - adding styles to everything, work on the buttons next make them 3d give them some personality starting with border gradients
 * 
 * - NEXT: 
 *    COMPLETED - add conditional for date so if entry is same date as current date you can't add another entry
 *              - use the development variable to control this, if development is set to false then this condition should be present
 *       - Follow Grok instructions of getting a rich text editor module/wrapper for TextInput so I can add text formatting per character
 * 
 * 
 * COMPLETED - add a modal to replace Alert modal
 * 
 * COMPLETED - add a status check to interface so I know if an entry has been inserted or not
 *      - need to now figure out how to pass a prop back to this component from Edit screen which will let Main screen flatlist item know
 *        if an entry was inserted in TextArea.tsx
 *      - to start off I need to figure out how to get the header Back navigation event and how to pass props to the previous screen***
 * 
 * 
 * 
 * 
 * COMPLETED - Playing around with the entry functionality, temporary confirmation might be a permenant feature to prevent accidental press
 *          - or entry click disables the button, populates a new view that allows for new entry and then once confirmed another entry can be created
 *            gotta figure out how I want to go about this
 *
 * COMPLETED - Date, make it so check the date, get current date now in toLocaleString format, compare the dates if the saved
 *   date matches todays date alert or return that an entry for todays date already exists.
 * 
 * COMPLETED - Flatlist item generation
 *
 * 
 *  
 * Future:
 * COMPLETED - Going to need date functionality so the date is attached to the entry
 * 
 * - Maybe add additional optional parameter for NoteData interface called SleepQuality or SleepDuration
 *   this parameter will be displayed above the view details button potentially and while not set offers option to 
 *   set the time you went to sleep the previous night and the time you woke up today and calculate how many hours you got of sleep
 * 
 * - Last modified detection, check if when entry is open if the content changes then return that check just like the storage key
 *   if that check exists then set last modified to date now
 * 
 * - Gameify the app
 *    - add achievements, titles, scores
 *    - add user profile to manage and display all those attributes above
 * 
 * 
 *
 * RESOLVED - Flatlist won't scroll fully
 *              - added fixed height of 3/4 of screen
 * 
 * RESOLVED (I THINK)- When I insert a value into an entry and go back, it will set to true
 *   but when i go back in and erase the value and make it an empty entry it won't reset to false unless I force a rerender
 *   by changing code adding log etc
 * 
 * 
 */


const[EntryStorageKeys, setEntryStorageKeys] = useState<string[]>([])


// remove storage key from useState array
const removeKey = async (key: string) => {

    if(EntryStorageKeys.length == 0){
        log.info('{108: EntryFlatlist => removeKey says} no keys to remove')
        return
    }

    //check if only 1 entry exists, just empty the array because filtering doesn't work, nothing to compare to
    // also if EntryStorageKey == '' that means no entries exist at all so empty the entire array
    if(EntryStorageKeys.length == 1 || EntryStorageKey == ''){
        //double check async storage
        if(EntryStorageKey){
            const item = await AsyncStorage.getItem(EntryStorageKey)
            //if a key exists remove it
            if(item != null && item == '')
            await AsyncStorage.removeItem(EntryStorageKey)
        }
        setEntryStorageKeys([])
    }
    else{
        setEntryStorageKeys(prevItems => {
        // Return a new array that includes all items except the one we want to remove
        return prevItems.filter(keys => keys !== key);
        });
       
       
    }
   
    
  };

interface StorageKey{
    input: string
}


// check if entry storage key exists
const EStorageKeyCheck = async () =>{
    
    if(EntryStorageKey){
        log.info('{145: EntryFlatlist => EStorageCheck says} is firing true')
        const jsonValue = await AsyncStorage.getItem(EntryStorageKey)

        log.info('{148: EntryFlatlist => EStorageCheck says} jsonvalue:',jsonValue)
        //jsonvalue will always exist because it is a full string
        if(jsonValue){
            //convert to object that matches the string setup
            const parsedValue = JSON.parse(jsonValue) as StorageKey;
            //if the key value is not empty, basically im checking if I opened an entry that had saved data, modified it to have no data
            //and then returned to Main screen, now I need to remove the key from the useState array because it has no data
            if(parsedValue.input){
                log.info(parsedValue.input)
                //make sure the key doesn't already exist
                if(!EntryStorageKeys.includes(EntryStorageKey)){
                // setEntryStorageKeys(EntryStorageKey) //figure this out
                    log.info('{160: EntryFlatList says}{144: EntryFlatlist => EStorageCheck says} storage key contains data but does not exist in the EntryStorageKeys array.. adding key to array:', EntryStorageKey)
                    setEntryStorageKeys([...EntryStorageKeys, EntryStorageKey])
                }
                else{
                    log.info('{164: EntryFlatlist => EStorageCheck says} storage key contains data nothing else needs to be done:', EntryStorageKey)
                    
                }   
            }
            else{
                log.info('{169: EntryFlatlist => EStorageCheck says} removing storage key')
                removeKey(EntryStorageKey)
            }
           
        }
        // null value, remove key
        else{
            log.info('{176: EntryFlatlist => EStorageCheck says} null key value, removing key')
            removeKey(EntryStorageKey)
        }  
    }
    else{
        log.info('{181: EntryFlatlist => EStorageCheck says} storage key does not exist')
    }
}

// FLAT LIST COMPONENT LOGIC

//development variables if ever needed
const isDevelopment:boolean = true
const disableScrollTo:boolean = false //disable the flatlist scroll to that gives me an error whenever I change newItemCount default from 0 to any number for testing purposes

//get current date
const now: Date = new Date()
// item variables
const[newItemCount, setItemCount] = useState<number>(0)
const[totalItemCount, setTotalItemCount] = useState<number | null>(null)
const[newItemDate, setItemDate] = useState<string>(now.toLocaleDateString())
const[isFocused, setIsFocused] = useState(false);
// archiving variables
const archiveItemLimit = 30
const[isCollapsed, setIsCollapsed] = useState<boolean>(false)
const[archiveCount, setArchiveCount] = useState<number>(0)
// refs
const flatListref = useRef<FlatList>(null)
// const[doesDataExist, retrieveData] = useState<boolean | null>(null);



interface NoteData {
    id: string
    itemCount: number
    date?: string
    entry_status?:string
  }

// flatlist items
const[items,setItems] = useState<NoteData[]>([
    {id: '0', itemCount: 1, date: now.toLocaleDateString(), entry_status:'false'}

])


//storage key check
useEffect(()=>{

    
    if(EntryStorageKey == ''){
        log.info('{226: EntryFlatlist => UseEffect says} storage key does not exist')
        removeKey(EntryStorageKey)
    }


    if(EntryStorageKey && !EntryStorageKeys.includes(EntryStorageKey)){
        log.info('{232: EntryFlatlist => UseEffect says} storage key from Main passed all the way from the entry in TextArea:', EntryStorageKey)
        setTimeout(() => {
                   EStorageKeyCheck()
                },300)
    }else if(EntryStorageKey && EntryStorageKeys.includes(EntryStorageKey)){
        log.info('{237: EntryFlatlist => UseEffect says} storage key from Main passed all the way from the entry in TextArea already exists:', EntryStorageKey)
        setTimeout(() => {
            EStorageKeyCheck()
         },300)
    }

},[EntryStorageKey, route.params])

useEffect(()=>{
    log.info('{246: EntryFlatlist => useEffect says} remaining keys:',EntryStorageKeys)
},[EntryStorageKeys])

// STORE THE KEY VALUE
const storeData = async (key: string, value: NoteData): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      log.info(jsonValue)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      log.error("{256: EntryFlatlist => StoreData says} Error saving data", error);
    }
  };

// GET THE KEY VALUE NOT IN USE ************** ATM
  const getData = async (key: string): Promise<NoteData | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      // Parse the JSON string back into a User object, or return null if no value
      if (jsonValue != null) {
        const parsedValue = JSON.parse(jsonValue) as NoteData;
        
       log.info('input value:', parsedValue.date);  // Logs just the 'input' value, e.g., 'some value'
        return parsedValue;
      }
      return null;
    } catch (error) {
      log.error("{273: EntryFlatlist => getData says} Error retrieving data", error);
      return null;
    }
  };


// REMOVE THE STORAGE KEY
const resetData = async (): Promise<void> => {
    try {
    //   const jsonValue = await AsyncStorage.getItem(key);
    //   log.info('item to be removed:',  key,entryKey)

      const keys = await AsyncStorage.getAllKeys();
        if(keys != null){
        keys.forEach(async (key) =>{
            await AsyncStorage.removeItem(key)
        })
      }
    //   // Parse the JSON string back into a User object, or return null if no value
    //   if (jsonValue != null) {
    //     await AsyncStorage.removeItem(key)
    //     await AsyncStorage.removeItem(entryKey)
       
    //   }
    } catch (error) {
      log.error("{298: EntryFlatlist => resetData says} Error resetting data", error);
    }
  };


  const reset = () =>{

      if(newItemCount == 0){
        log.info('{306: EntryFlatlist => reset says} nothing to reset')
        return
      }
      const entryStorageKey = `entry${newItemCount}`

        Alert.alert(
            "",
            "WARNING: Are you sure you want to clear storage data? This action cannot be undone.",
            [
                {
                    text: "Yes",
                    onPress: () =>{    
                            setItems([])
                            setItemCount(0)
                            setEntryStorageKeys([])
                            resetData()
                            return
                    },
                    style:'destructive'
                },
                {
                    text: "No",
                    onPress: () =>{
                        return
                    },
                    style:'cancel'
                }
            ]
        )

  }

// PRODUCTION USE, CHECK IF ANY OF THE ENTRY DATES MATCH THE CURRENT DATE, SHOULDNT BE ABLE TO ADD MULTIPLE ENTRIES
const checkEntryDate = async()=>{

    const keys = await AsyncStorage.getAllKeys()

    let doesTodaysDateExist:boolean = false

    //for of for allowing breaks in an async function
    for (const key of keys) {
        const jsonValue = await AsyncStorage.getItem(key)
        if(jsonValue){
        const parsedInput = JSON.parse(jsonValue) as NoteData
            //an entry with the current date exists
            if(parsedInput.date == now.toLocaleDateString()){
                log.debug('first instance of this condition', parsedInput)
                doesTodaysDateExist = true
                break
            }
           
        }
       
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    return doesTodaysDateExist
}


const increment = () => {
    Alert.alert(
        "", // Dialog Title
        "Are you sure you want to add a new entry?", // Dialog Message
        [
          {
            text: "Yes",
            onPress: async () => {
                //DATE CHECK ONLY IF PRODUCTION SO DEVELOPMENT VARIABLE MUST BE SET TO FALSE FOR THIS TO SATISFY
                if(!isDevelopment){
                    const promise = await checkEntryDate()
                    if(promise){
                        Alert.alert(
                            "", // Dialog Title
                            "Entry with today\'s date already exists!, you cannot create another entry for today.", // Dialog Message
                            [
                                {
                                   text: "OK",
                                   onPress: () =>{
                                    return
                                    },
                                   style:'cancel'
                                }
                            ]
                        )
                        setIsFocused(false)
                        return
                    }
                }
                


                // 30 DAYS CHECK
                if(newItemCount % archiveItemLimit === 0 && newItemCount > 0){
                    Alert.alert(
                        "",
                        "Would you like to archive the last 30 entries?",
                        [
                            {
                                text: "Yes",
                                onPress: () =>{
                                    setIsCollapsed(true)
                                    setArchiveCount(archiveCount + 1)
                                    log.info('{358: EntryFlatlist => increment says} total archives:', archiveCount)
                                },
                                style:'default'
                            },
                            {
                                text: "No",
                                onPress: () =>{
                                    return
                                },
                                style:'cancel'
                            }
                        ]
                    )
                }



                setIsFocused(false)
                const entryDate: Date = new Date()
                const STORAGE_KEY = `item_${newItemCount + 1}`
                storeData(STORAGE_KEY, {id:newItemCount.toString() ,itemCount: newItemCount + 1, date: entryDate.toLocaleDateString(), entry_status:'false'})
                setItemCount(newItemCount + 1)
                setItemDate(entryDate.toLocaleDateString())
                const newItem: NoteData ={
                    id: newItemCount.toString(),
                    itemCount: newItemCount + 1,
                    date: newItemDate,
                    entry_status:'false'
                }
                setItems(prevItems => [...prevItems, newItem])
                //scroll to new item added only after 1 item DISABLED ATM FOR TESTING PURPOSES
                if(newItemCount - 1 > 0 && !disableScrollTo){
                    const index = newItemCount - 1
                    log.info('{391: EntryFlatlist => increment says} index to scroll to:',index)
                    //timeout needed in order to go to last index after item is rendered
                    setTimeout(()=>{
                        flatListref.current?.scrollToIndex({index:index})
                    }, 500)
                }
               
            },
            style: "default" // Applies 'cancel' styling (e.g., bold on iOS)
          },
          {
            text: "No",
            onPress: () => {
                setIsFocused(false) 
                return},
            style: "cancel" // Applies 'destructive' styling (e.g., red text on iOS)
          }
        ],
        { cancelable: false } // Prevents closing by tapping outside the dialog
      );

}




// load the keys into the EntryStorageKeys useState array
const loadEntryKeys = async () =>{

    const keys = await AsyncStorage.getAllKeys()

    keys.forEach((key) =>{

        //get the key type
        const keyType = key.split('_')[0]
        if(keyType == 'entry'){
            if(!EntryStorageKeys.includes(key))
            setEntryStorageKeys(prevKeys => [...prevKeys,key])
        }

    })
    log.info('{433: EntryFlatlist => loadEntryKeys says} loaded entry keys')
}


//GET AND SET ENTRY KEYS INTO EntryStorageKeys on load
useEffect(()=>{
    loadEntryKeys()

},[])

// FLATLIST ITEM TO RENDER, EACH ITEM IS AN ENTRY THAT WILL GO TO THE EDIT SCREEN WHICH HAS THE TEXTAREA COMPONENT
// THE ITEM PASSES UNIQUE STORAGE KEY TO EACH COMPONENT TO CREATE SEPARATE ASYNCSTORAGE INSTANCES
const renderItem = ({item}: {item: NoteData}) => {
    // if the item limit has hit 30
    log.info('{451: EntryFlatlist => renderItem says} render item:',item)
    
    return(
        <ItemComponent item={item} EntryStorageKeys={EntryStorageKeys} navigation={navigation}/>
    )

   
}


const retrieveData = async (): Promise<void>  => {
    const keys  = await AsyncStorage.getAllKeys()
    setItems([]) //remove previous items

    // initiate empty array
    let itemKeys:Array<string> = []

    keys.forEach((key,index) =>{
        //KEY FILTER MAKE SURE IT IS AN ITEM KEY
        const keyFilter = key.split('_')[0]

        //filter the array for item keys only
        if(keyFilter == 'item'){
            itemKeys.push(key) //push to new array
        }
    })

    
    //SORT THE ARRAY NUMERICALLY
    itemKeys.sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      });

    log.info('{484: EntryFlatlist => retrieveData says} new array:',itemKeys)

    //loop through each key in the filtered array
    itemKeys.forEach(async (key, index)=>{
        log.info('{484: EntryFlatlist => retrieveData says}', key, index)

        // SET ITEM COUNT TO FINAL ITEM
        if(index == itemKeys.length - 1){
            log.info('{492: EntryFlatlist => retrieveData says} this is the last item:', key,index)
            const ItemCount = key.split('_')[1] //get the item count at the end
            setItemCount(parseInt(ItemCount)) //convert string to int because setItemCount expects a number
            setTotalItemCount(parseInt(ItemCount))
        }

        //get the json value of the storage key
        const jsonValue = await AsyncStorage.getItem(key)
        if(jsonValue){
            const item = JSON.parse(jsonValue) as NoteData
            setItems(prevItems => [...prevItems, item])
        }
       
        
    })
}


// load saved data if it exists on initial mount
useEffect(() =>{

    //   GET ALL THE KEYS
    retrieveData()

  },[]);


useEffect(()=>{
    log.info('{516: EntryFlatlist => useEffect says} focus status from entry flatlist:', isFocused)
},[isFocused])

useEffect(() =>{
    log.info('{520: EntryFlatList => useEffect says} items should get added:', items)
},[items])


    return(

        <View>
            <LinearGradient
            colors={isFocused?['#23f707','#5fc752','#00bc7d']:['#919191', '#737373', '#bfbfbf']}
            // style={{borderWidth:2, padding:15, borderRadius:10, borderColor:}}
            style={styles.gradientWrapper}
            >
            <View style={styles.innerContent}>
                <LinearGradient
                        colors={['#404952','#505b66','#657482']}
                        style={styles.gradientWrapper}
                        >
                <Pressable onPressIn={() => setIsFocused(true)} onPressOut={() => increment()}> 
                    <View className=' flex flex-row items-center' style={{padding:12, borderColor:isFocused?'lime':themeType.textPrimary}}>
                    <Feather style={{marginTop:4, marginRight:6}} name="plus-circle" size={24} color={isFocused?'lime' : themeType.textPrimary2} />
                    <Text style={{fontSize:16, marginTop:4, color:isFocused?'lime' : themeType.textPrimary2}}>Add Entry</Text>
                    </View>
                </Pressable>
                </LinearGradient>
            </View>
            </LinearGradient>
            {newItemCount > 0?
                <View className='flex w-full justify-center items-center mt-4'>
                <Pressable onPress={reset}>
                    <Text style={{fontFamily:'ScienceGothic-Regular', color:'#00bc7d'}}>CLEAR</Text>
                </Pressable>
                </View>
            :null}
        
            <View className='flex w-full justify-center items-center mt-10 pb-24'>
            {newItemCount == 0 ?
                <Text style={{color:themeType.textPrimary}}>No Entries to list</Text>:(<>
                    {/* FLATLIST OF ITEMS */}
                    <FlatList
                        ref={flatListref}
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        className='w-full h-[80%] pb-10'
                    
                    />

                    {/* <Text>Entry Created On:<Text> {newItemDate}</Text></Text>
                    <Text>DAY: {newItemCount}</Text> */}
                </>)
                
                
            }
            </View>
        
        
        
            {/* THIS WILL BE THE ONPRESS FUNCTION SETUP FOR THE FLATLIST ITEM, STORAGEKEY WILL PASS UNIQUE ID */}
            <View>
            
            </View>
        
        
        
        
        
        
        
        
        
        
        
        </View>
       
        
    )
}

const styles = StyleSheet.create({
    gradientWrapper: {
        padding: 1, // This defines the border thickness
        borderRadius: 12, // Apply border radius to the gradient
        overflow: 'hidden', // Essential for radius to work correctly
        
      },
      innerContent: {
        
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

})