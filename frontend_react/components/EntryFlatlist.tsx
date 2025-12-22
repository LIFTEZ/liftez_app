import { useEffect, useState,useRef, use } from 'react';
import {Text, View, Pressable,Button, Alert, FlatList} from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '@/src/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ItemComponent from './Item';
import { useTheme } from '@/src/ThemeContext';



//required to get access to navigation defines the parameters expected to pass from the parent component which is MainScreen.tsx
type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

interface ParentProps {
    EntryStorageKey?: string  
}

type EntryFlatlistProps = MainScreenProps & ParentProps;

export default function EntryFlatlist({navigation, route, EntryStorageKey}: EntryFlatlistProps){

//theme context
const{theme, themeType} = useTheme()
    console.log('STORAGE KEY:', EntryStorageKey)
    
/**
 * 
 * 
 * 
 * CURRENTLY WORKING ON:
 *
 * 
 * - NEXT: 
 *       - create a way to archive all the entries every 30 days
 *          atm - achieved but only hard coded temporarily for the first 30 entries
 *        if i want a constant archive of every 30 days then I gotta implement archive count check with IDs and bunch of other
 *        stuff
 *       - add conditional for date so if entry is same date as current date you can't add another entry
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
 * - Last modified detection, check if when entry is open if the content changes then return that check just like the storage key
 *   if that check exists then set last modified to date now
 * 
 * - Gameify the app
 *    - add achievements, titles, scores
 *    - add user profile to manage and display all those attributes above
 * 
 * 
 * Issues: NONE at the moment
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
        console.log('{func removeKey says} no keys to remove')
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
        console.log('this is firing true')
        const jsonValue = await AsyncStorage.getItem(EntryStorageKey)

        console.log('jsonvalue:',jsonValue)
        //jsonvalue will always exist because it is a full string
        if(jsonValue){
            //convert to object that matches the string setup
            const parsedValue = JSON.parse(jsonValue) as StorageKey;
            //if the key value is not empty, basically im checking if I opened an entry that had saved data, modified it to have no data
            //and then returned to Main screen, now I need to remove the key from the useState array because it has no data
            if(parsedValue.input){
                console.log(parsedValue.input)
                //make sure the key doesn't already exist
                if(!EntryStorageKeys.includes(EntryStorageKey)){
                // setEntryStorageKeys(EntryStorageKey) //figure this out
                    console.log('{EntryFlatList says} storage key contains data but does not exist in the EntryStorageKeys array.. adding key to array:', EntryStorageKey)
                    setEntryStorageKeys([...EntryStorageKeys, EntryStorageKey])
                }
                else{
                    console.log('{EntryFlatList says} storage key contains data nothing else needs to be done:', EntryStorageKey)
                    
                }   
            }
            else{
                console.log('removing storage key')
                removeKey(EntryStorageKey)
            }
           
        }
        // null value, remove key
        else{
            console.log('null key value, removing key')
            removeKey(EntryStorageKey)
        }  
    }
    else{
        console.log('storage key does not exist')
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
        console.log('storage key does not exist')
        removeKey(EntryStorageKey)
    }


    if(EntryStorageKey && !EntryStorageKeys.includes(EntryStorageKey)){
        console.log('{EntryFlatList says} storage key from Main passed all the way from the entry in TextArea:', EntryStorageKey)
        setTimeout(() => {
                   EStorageKeyCheck()
                },300)
    }else if(EntryStorageKey && EntryStorageKeys.includes(EntryStorageKey)){
        console.log('{EntryFlatList says} storage key from Main passed all the way from the entry in TextArea already exists:', EntryStorageKey)
        setTimeout(() => {
            EStorageKeyCheck()
         },300)
    }

},[EntryStorageKey,items])

useEffect(()=>{
    console.log('{EntryFlatlist useEffect says} remaining keys:',EntryStorageKeys)
},[EntryStorageKeys])

// STORE THE KEY VALUE
const storeData = async (key: string, value: NoteData): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log(jsonValue)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

// GET THE KEY VALUE NOT IN USE ************** ATM
  const getData = async (key: string): Promise<NoteData | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      // Parse the JSON string back into a User object, or return null if no value
      if (jsonValue != null) {
        const parsedValue = JSON.parse(jsonValue) as NoteData;
        
       console.log('input value:', parsedValue.date);  // Logs just the 'input' value, e.g., 'some value'
        return parsedValue;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving data", error);
      return null;
    }
  };


// REMOVE THE STORAGE KEY
const resetData = async (): Promise<void> => {
    try {
    //   const jsonValue = await AsyncStorage.getItem(key);
    //   console.log('item to be removed:',  key,entryKey)

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
      console.error("Error resetting data", error);
    }
  };


  const reset = () =>{

      if(newItemCount == 0){
        console.log('nothing to reset')
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


const increment = () => {
    Alert.alert(
        "", // Dialog Title
        "Are you sure you want to add a new entry?", // Dialog Message
        [
          {
            text: "Yes",
            onPress: () => {

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
                                    console.log('total archives:', archiveCount)
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
                    console.log('index to scroll to:',index)
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
    console.log('loaded entry keys')
}


//GET AND SET ENTRY KEYS INTO EntryStorageKeys on load
useEffect(()=>{
    loadEntryKeys()

},[])

// FLATLIST ITEM TO RENDER, EACH ITEM IS AN ENTRY THAT WILL GO TO THE EDIT SCREEN WHICH HAS THE TEXTAREA COMPONENT
// THE ITEM PASSES UNIQUE STORAGE KEY TO EACH COMPONENT TO CREATE SEPARATE ASYNCSTORAGE INSTANCES
const renderItem = ({item}: {item: NoteData}) => {
    // if the item limit has hit 30
    console.log('render item:',item)
    
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

    console.log('new array:',itemKeys)

    //loop through each key in the filtered array
    itemKeys.forEach(async (key, index)=>{
        console.log(key, index)

        // SET ITEM COUNT TO FINAL ITEM
        if(index == itemKeys.length - 1){
            console.log('this is the last item:', key,index)
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
    console.log('focus status from entry flatlist:', isFocused)
},[isFocused])

useEffect(() =>{
    console.log('{EntryFlatList.tsx says} items should get added:', items)
},[items])


    return(

        <View>
            <Pressable onPressIn={() => setIsFocused(true)} onPressOut={() => increment()}> 
            <View className='border-2 rounded-lg flex flex-row items-center' style={{marginTop:20, padding:12, borderColor:isFocused?'green':themeType.textPrimary}}>
            <Feather style={{marginTop:4, marginRight:6}} name="plus-circle" size={24} color={isFocused?'green' : themeType.textPrimary} />
            <Text style={{fontSize:16, marginTop:4, color:isFocused?'green' : themeType.textPrimary}}>Add Entry</Text>
            </View>
            </Pressable>
            {newItemCount > 0?
                <View>
                <Button onPress={reset} title='Clear' />
                </View>
            :null}
        
            <View className='flex w-full justify-center items-center mt-10'>
            {newItemCount == 0 ?
                <Text style={{color:themeType.textPrimary}}>No Entries to list</Text>:(<>
                    {/* FLATLIST OF ITEMS */}
                    <FlatList
                        ref={flatListref}
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        className='w-full h-3/4 pb-10'
                    
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