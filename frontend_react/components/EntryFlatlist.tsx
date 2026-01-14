import React, { useEffect, useState,useRef, use } from 'react';
import {Text, View, Pressable,Button, Alert, FlatList, StyleSheet, Modal, ScrollView, NativeSyntheticEvent, NativeScrollEvent, TextInput, BlurEvent, LayoutChangeEvent} from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '@/src/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ItemComponent from './Item';
import { useTheme } from '@/src/ThemeContext';
import {LinearGradient} from 'expo-linear-gradient'
import log from '@/src/utils/Logger';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
    lastModified:string
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
const isDevelopment:boolean = true //set to true for debugging at the moment @ 8:24 am 12/23/2025
const disableScrollTo:boolean = false //disable the flatlist scroll to that gives me an error whenever I change newItemCount default from 0 to any number for testing purposes

//get current date
const now: Date = new Date()
// item variables
const[newItemCount, setItemCount] = useState<number>(0) //change back to 0 when done debugging
const[totalItemCount, setTotalItemCount] = useState<number | null>(null)
const[newItemDate, setItemDate] = useState<string>(now.toLocaleDateString())
const[isFocused, setIsFocused] = useState(false);
// archiving variables
const archiveItemLimit = 30
const[isCollapsed, setIsCollapsed] = useState<boolean>(false)
const[archiveCount, setArchiveCount] = useState<number>(0)
// refs
const flatListref = useRef<FlatList>(null)
const scrollToBottomBtn = useRef<View>(null)
const scrollToTopBtn = useRef<View>(null)
const clearBtn = useRef<View>(null)
const goToIndexInput = useRef<TextInput>(null)
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
      log.info('{EntryFlatlist => storeData says',jsonValue)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      log.error("{256: EntryFlatlist => StoreData says} Error saving data", error);
    }
  };
// STORE THE ARCHIVE KEY
const storeArchiveData = async (key: string, value: ArchiveData): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      log.info('{EntryFlatlist => storeArchiveData says:}',jsonValue)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      log.error("{256: EntryFlatlist => StoreData says} Error saving data", error);
    }
  };

// // GET THE KEY VALUE NOT IN USE ************** ATM
//   const getData = async (key: string): Promise<NoteData | null> => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(key);
//       // Parse the JSON string back into a User object, or return null if no value
//       if (jsonValue != null) {
//         const parsedValue = JSON.parse(jsonValue) as NoteData;
        
//        log.info('input value:', parsedValue.date);  // Logs just the 'input' value, e.g., 'some value'
//         return parsedValue;
//       }
//       return null;
//     } catch (error) {
//       log.error("{273: EntryFlatlist => getData says} Error retrieving data", error);
//       return null;
//     }
//   };


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

interface ArchiveData{
    count:number
    min:number
    max:number
    isCollapsed:boolean
    isColFocused:boolean
}


const [archives, setArchive] = useState<ArchiveData[]>([]) //REQUIRED FOR NON APP REFRESH FUNCTIONALITY
const [archiveStorageKeys, setArchiveKeys] = useState<string[]>([]) //REQUIRED FOR APP REFRESH LOADING THE ARCHIVE KEYS

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
                    setIsCollapsed(true)
                                   
                    const ARCHIVE_KEY = `archive_${archiveCount + 1}`
                    const max = 1 + (archiveItemLimit * (archiveCount + 1))
                    const min = max - 30
                    storeArchiveData(ARCHIVE_KEY, {count: archiveCount + 1, min:min, max:max, isCollapsed:false, isColFocused:false})
                    setArchiveCount(archiveCount + 1)
                    const newArchive: ArchiveData ={
                        count: archiveCount + 1,
                        min: min,
                        max: max,
                        isCollapsed:false,
                        isColFocused:false,
                        
                    }
                    setArchive(prevArchives => [...prevArchives, newArchive])
                    setArchiveKeys(prevKeys => [...prevKeys, ARCHIVE_KEY])
                    log.info('{358: EntryFlatlist => increment says} total archives:', archiveCount + 1)
                    
                    
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
const loadEntryKeys = async () :Promise<void> =>{

    const keys = await AsyncStorage.getAllKeys()
    let keyCount: number = 0
    keys.forEach((key) =>{

        //get the key type
        const keyType = key.split('_')[0]
        if(keyType == 'entry'){
            if(!EntryStorageKeys.includes(key)){
            setEntryStorageKeys(prevKeys => [...prevKeys,key])
            keyCount+=1
            }
        }

    })
    if(keyCount > 0){
    log.info(`{433: EntryFlatlist => loadEntryKeys says} loaded ${keyCount} entry keys`)
    }
    else{
    log.info('{433: EntryFlatlist => loadEntryKeys says} no entry keys to load')
    }

}


//GET AND SET ENTRY KEYS INTO EntryStorageKeys on load
useEffect(()=>{
    loadEntryKeys()

},[])


const loadArchiveKeys = async ()  =>{

    //reset the local usestate array
    setArchive([])
    //REFACTOR REDO THIS LOGIC AFTER EATING
    //initiate archive count variable
    let archCount:number = 0
    // initiate archive array
    let archiveKeys:Array<string> = []
    //get all the keys
    const keys = await AsyncStorage.getAllKeys()
    keys.forEach(async (key)=>{

        //make sure key is an archive key
        const keyType = key.split('_')[0]
        if(keyType == 'archive'){
            //push to non usestate array
            archiveKeys.push(key)
            
        }

    })
    //SORT THE ARRAY NUMERICALLY
    archiveKeys.sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      });

    log.info('{592: EntryFlatlist => loadArchiveKeys says} new array:',archiveKeys)

    
    //loop through each key in the filtered array
    archiveKeys.forEach(async (key, index)=>{
        log.info('{484: EntryFlatlist => loadArchiveKeys  says}', key, index)
        if(!archiveStorageKeys.includes(key)){
        setArchiveKeys(prevKeys => [...prevKeys,key])
        }
        
        //get the json value of the storage key
        const jsonValue = await AsyncStorage.getItem(key)
        if(jsonValue){
            const archive = JSON.parse(jsonValue) as ArchiveData
            archCount+=1 //increment count
            setArchiveCount(archCount)
            setArchive(prevArchives => [...prevArchives, archive])
        }
    
    
    })
    log.info('EntryFlatList => useEffect after loadArchiveKeys says:', archives)

}



//GET AND SET ARCHIVE KEYS ON LOAD
useEffect(()=>{
    //timeout required for collapsible render
    setTimeout(()=>{
        loadArchiveKeys() 
    },300)
  
    
},[])

useEffect(()=>{
    setTimeout(()=>{
        log.info('{639: EntryFlatlist => useEffect says} archive keys:', archiveStorageKeys, archives)
        log.debug('640: EntryFlatlist => useEffect says archive count:', archiveCount)
    },500)
   
},[archiveStorageKeys,archives, archiveCount])

// FLATLIST ITEM TO RENDER, EACH ITEM IS AN ENTRY THAT WILL GO TO THE EDIT SCREEN WHICH HAS THE TEXTAREA COMPONENT
// THE ITEM PASSES UNIQUE STORAGE KEY TO EACH COMPONENT TO CREATE SEPARATE ASYNCSTORAGE INSTANCES
const refsArray = useRef<View[] | null[]>([])

let status:boolean = false
const toggleFocus = (count:number)=>{

    const newArray = archives.map((archive, index) => {
        if (index === count - 1) {

            
            if(!archive.isColFocused){
                status = true
            }
            else{
                status = false
            }
        
          // If the index matches, create a NEW object with the updated property
          return { ...archive,  isColFocused:status };
        }
        // Otherwise, return the original item
        return archive;
      });
    setArchive(newArray)
}

const toggleCollapse = (count: number) =>{
    
    archives.forEach((archive, index) =>{
        log.debug(index)
        //make sure correct archive button is being hit
        if(archive.count == count){


            const newArray = archives.map((archive, index) => {
                if (index === count - 1) {
        
                  // If the index matches, create a NEW object with the updated property
                  return { ...archive,  isColFocused:status };
                }
                // Otherwise, return the original item
                return archive;
              });
            setArchive(newArray)


            //loop thru refs
            refsArray.current.forEach((ref,index ) =>{
                //set item count from index
                const itemC = index + 1
                //same conditional as the renderItem
                if(itemC >= archive.min && itemC < archive.max){
                    

                    //UPDATE THE OBJECT LOCALLY
                    let status:boolean = archive.isCollapsed
                    if(!archive.isCollapsed){
                        status = true
                    }else{
                        status = false
                    }
                    //UPDATE THE OBJECT IN STORAGE
                    const ARCHIVE_KEY = `archive_${archive.count}`
                    const max = 1 + (archiveItemLimit * (archive.count))
                    const min = max - 30
                    storeArchiveData(ARCHIVE_KEY, {count: archive.count, min:min, max:max, isCollapsed:status, isColFocused:false})

                    ref?.setNativeProps({
                        style:{
                            display:!archive.isCollapsed?'none':'flex' //if false set to none because the collapse status will be updated to true
                        }
                    }) 
                
                    const newArray = archives.map((archive, index) => {
                        if (index === count - 1) {
                          // If the index matches, create a NEW object with the updated property
                          return { ...archive,  isCollapsed:status };
                        }
                        // Otherwise, return the original item
                        return archive;
                      });
                    setArchive(newArray)
                    log.debug('new array', newArray)
                    log.debug(archives)
                    
                     
                }
            
            
            })
            
        }
    })

}

const [height, setHeight] = useState<number>(0);


//used for flatlist performance and rendering, triggered by items when archives do NOT exist
const onLayout = (event: LayoutChangeEvent) => {
    const{height} = event.nativeEvent.layout
    setHeight(height);
    // log.debug('height of entry item:', height)

  }

// counter function for onLayout prop on the View when archives exist, height should usually be set already by then
const heightIsSet = () => {
    return
}

const renderItem = ({item}: {item: NoteData}) => {


    return(
        <View>
        {archives.length > 0?
        (<>
        {/* ARRAY MAP LOOP */}
        {Object.entries(archives).map(([key,archive]) => (
        // needed for the setup when using (<></>) 
          <React.Fragment key={key}>
            {item.itemCount == 1 && archive.count == 1 && archive.isCollapsed?
            <View className='flex justify-center items-center'>
            <Text style={{color:'#00bc7d', fontFamily:'ScienceGothic-Regular'}}>*hold to collapse/expand*</Text>
            </View>
            :null}
                {item.itemCount >= archive.min && item.itemCount < archive.max?
                    (<>    
                    <View key={item.id}>
                    <View
                    onLayout={height == 0? onLayout:heightIsSet}
                    ref={(ref) => { refsArray.current[parseInt(item.id)] = ref; }}
                    style={{display:!archive.isCollapsed? 'flex' : 'none'}}>
                        <ItemComponent item={item} EntryStorageKeys={EntryStorageKeys} navigation={navigation} route={route} />                   
                    </View>
                    {item.itemCount == archive.max - 1?
                        (<>
                         <View className='mt-2'>
                        {archive.isCollapsed? (<>
                            <LinearGradient
                            colors={archive.isColFocused?['#23f707','#5fc752','#00bc7d']:['#919191', '#737373', '#bfbfbf']}
                            // style={{borderWidth:2, padding:15, borderRadius:10, borderColor:}}
                            style={styles.gradientWrapper}
                            >
                            <View style={styles.innerContent}>
                                <LinearGradient
                                        colors={['#404952','#505b66','#657482']}
                                        style={styles.gradientWrapper}
                                        >
                                <Pressable onPressIn={()=>toggleFocus(archive.count)}  onLongPress={()=>toggleCollapse(archive.count)}> 
                                    <View className=' flex flex-row justify-center items-center' style={{padding:12, borderColor:themeType.textPrimary}}>
                                    <Text style={{fontSize:16, marginTop:4, color:themeType.textPrimary2}}>DAYS {archive.min} - {archive.max-1},  LAST DATE: {item.date}</Text>
                                    </View>
                                </Pressable>
                                </LinearGradient>
                            </View>
                            </LinearGradient>
                            <Pressable onPressIn={()=>toggleFocus(archive.count)}   onLongPress={()=>toggleCollapse(archive.count)} > 
                            <View className='flex flex-row justify-center items-center mt-2'  >
                                    <View>
                                    <MaterialIcons name="expand" size={29} color={themeType.icon} />
                                    </View>
                                    <View >
                                    <Text className='border-1 p-1' style={{color:archive.isColFocused?'lime':'#00bc7d', fontFamily:'ScienceGothic-Regular', }} >EXPAND DAYS {archive.min} - {archive.max - 1}</Text>
                                    </View>
                                    <View>
                                    <MaterialIcons name="expand" size={29} color={themeType.icon} />
                                    </View> 
                            </View>
                            </Pressable>
                            </>) 
                        : (<>
                            <Pressable onPressIn={()=>toggleFocus(archive.count)}  onLongPress={()=>toggleCollapse(archive.count)} > 
                            <View className='flex flex-row justify-center items-center'>
                               
                                    <View>
                                        <MaterialCommunityIcons name="arrow-collapse-vertical" size={29} color={themeType.icon} />
                                    </View>
                                    <View className=''>
                                    <Text style={{color:archive.isColFocused?'lime':'#00bc7d', fontFamily:'ScienceGothic-Regular'}} >COLLAPSE DAYS {archive.min} - {archive.max - 1}</Text>
                                    </View>
                                    <View>
                                        <MaterialCommunityIcons name="arrow-collapse-vertical" size={29} color={themeType.icon} />
                                    </View> 
                                
                            </View>
                            </Pressable>    
                            </>)
                        }
                        </View>
                        </>)
                    :null}
                    </View>
                    </>)
                //making sure the key or archive.count equals the last index of the archives array so it doesn't register the mins and maxes of the previous archives
                :item.itemCount >= archive.max && archive.count == archives.length?
                (<>
                <ItemComponent item={item} EntryStorageKeys={EntryStorageKeys} navigation={navigation} route={route} />
                </>):null}
           
           
            </React.Fragment>
        ))}
        {/* END OBJECT ARRAY MAP */}
        </>)
        // NO ARCHIVES EXIST
        :<View onLayout={onLayout}> 
        <ItemComponent item={item} EntryStorageKeys={EntryStorageKeys} navigation={navigation} route={route} />
        </View>}
            
        </View>  
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
        log.info('{885: EntryFlatlist => retrieveData says}', key, index)

        // SET ITEM COUNT TO FINAL ITEM
        if(index == itemKeys.length - 1){
            log.info('{492: EntryFlatlist => retrieveData says} this is the last item:', key,index)
            const ItemCount = key.split('_')[1] //get the item count at the end
            //const ItemCount = '268' //hard code for debug purposes 58, 88, 118, 148, 178, 208, 238
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
    log.info('{922: EntryFlatList => useEffect says} items should get added:', items)
},[items])


// FLATLIST SCROLLING FUNCTIONS/LOGIC
const Scroll2Top = () =>{

    flatListref.current?.scrollToOffset({offset: 0})

}

const Scroll2Bottom = () => {

    log.debug('total item count:', newItemCount - 1)
    flatListref.current?.scrollToIndex({index: newItemCount - 1}) //scroll to index works with getItemLayout prop being set on FlatList

    
}

const [input,setText] = useState<string>('')
// const [contentHeight, setContentHeight] = useState<number>(0) // (DEPRECATED) was used to prevent error on initial load that index is out of render view
                                                                 // solved by using getItemLayout prop and passing the height of each item
const goToIndex = (e: BlurEvent) =>{
    
      if(input == '')
        return

      if(parseInt(input) - 1 <= -1){
        setText('')
        return
      }
    
      if(parseInt(input) - 1 >= newItemCount){
        Alert.alert
        (   'INVALID INPUT',
            `This day does not exist, the most recent or current day is ${newItemCount}!`
        )
        setText('')
        return
      }

      flatListref.current?.scrollToIndex({index:parseInt(input) - 1})
      setText('')
}




const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {

    const scrollDistance = event.nativeEvent.contentOffset.y
    // setContentHeight(event.nativeEvent.contentSize.height)

    if(scrollDistance >= 100){
        //CLEAR BUTTON ONLY EXISTS FOR DEVELOPMENT PURPOSES
        clearBtn.current?.setNativeProps({
            style:{
                display:'none'
            }
        })
        goToIndexInput.current?.setNativeProps({
            style:{
                display:'flex'
            }
        })
        scrollToBottomBtn.current?.setNativeProps({
            style:{
                display:'flex'
            }
        })
        scrollToTopBtn.current?.setNativeProps({
            style:{
                display:'flex'
            }
        })
  
    }
    else if(scrollDistance <= 0){
        //CLEAR BUTTON ONLY EXISTS FOR DEVELOPMENT PURPOSES
        clearBtn.current?.setNativeProps({
            style:{
                display:'flex'
            }
        })
        goToIndexInput.current?.setNativeProps({
            style:{
                display:'none'
            }
        })
        scrollToBottomBtn.current?.setNativeProps({
            style:{
                display:'none'
            }
        })
        scrollToTopBtn.current?.setNativeProps({
            style:{
                display:'none'
            }
        })
        
    }
    
}


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
            <View className='flex flex-row justify-between items-center'>
            <View ref={scrollToTopBtn} style={{display:'none'}}>
            <Pressable className='mt-4' onPress={Scroll2Top}>
            <FontAwesome name="angle-double-up" size={40} color="#00bc7d" />
            </Pressable>
            </View>
            <View ref={goToIndexInput} style={{display:'none'}} className='mt-4'>
                <TextInput className='border-2 rounded-lg p-2 border-emerald-500 text-emerald-500 w-52 text-center'
                style={{backgroundColor:themeType.screenBg}} 
                placeholderTextColor='#a8a8a8'
                value={input} 
                onChangeText={setText}
                onBlur={goToIndex} 
                placeholder='type in a day number'
                selectionColor={'#52eb34'}/>
            </View>
            {newItemCount > 0?
                //CLEAR BUTTON ONLY EXISTS FOR DEVELOPMENT PURPOSES REMOVE OR COMMENT OUT ONCE READY FOR PRODUCTION
                <View
                ref={clearBtn} 
                className='flex w-full items-center mt-4'>
                <Pressable onPress={reset}>
                    <Text style={{fontFamily:'ScienceGothic-Regular', color:'#00bc7d'}}>CLEAR</Text>
                </Pressable>
                </View>
            :null}
            <View ref={scrollToBottomBtn} style={{display:'none'}}>
            <Pressable className='mt-4' onPress={Scroll2Bottom}>
            <FontAwesome name="angle-double-down" size={40} color='#00bc7d' />
            </Pressable>
            </View>
            </View>
            
        
            <View className='flex w-full justify-center items-center mt-4 pb-48'>
            {newItemCount == 0 ?
                <Text style={{color:themeType.textPrimary}}>No Entries to list</Text>:(<>
                    {/* FLATLIST OF ITEMS */}
                    <FlatList
                        ref={flatListref}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        className='w-full h-[85%] pb-20'
                        getItemLayout={(items, newItemCount) => ({length: height, offset: height * newItemCount, index: newItemCount})}
                        
                        
                    
                    />
                </>)
                
                
            }
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
      },
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
      gradientWrapper2: {
          padding: 4, // This defines the border thickness
          borderRadius: 12, // Apply border radius to the gradient
          overflow: 'hidden', // Essential for radius to work correctly
          
        },
        innerContent2: {
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
})