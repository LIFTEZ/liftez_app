import { useEffect,useMemo,useState,useRef, use } from 'react';
import { View,Text, StyleSheet,Alert, Pressable, Animated, ScrollView, FlatList, LogBox} from 'react-native';
import { useTheme } from '@/src/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegimenBuildParamList } from '@/src/types';
import log from '@/src/utils/Logger';
import RadioGroup from 'react-native-radio-buttons-group';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-element-dropdown';
import BuilderButton from '../Buttons/BuilderButton';
import BuilderSelectCheckbox from './BuilderSelectCheckbox';
import { Checkbox } from 'expo-checkbox';

//IGNORE THIS ERROR
LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
  ]);

type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};

type FullParams = RegimenBuildParamList & RootStackParamList


type RegimenSelectProps = NativeStackScreenProps<FullParams, 'RegimenSelect'>;

const RegimenSelect = ({navigation, route}: RegimenSelectProps) =>{

    //BOTH TEMPLATE AND MANUAL SELECTION SECTION ***********************************

    const{themeType} = useTheme()
    //form variables, focus status of the return/close buttons for form settings
    const [optionReturn, setOptionReturn] = useState<boolean>(false);
    //radiobutton variables
    const [selectedId, setSelectedId] = useState<string | undefined>(); //radiobutton 1, yes/no for predefined template or manual selection
    const daysCount:string[] = ['3 DAYS', '4 DAYS', '5 DAYS']
    const daysShort:string[] = ['Sun','Mon','Tues','Weds','Thurs','Fri','Sat']
    const days:string[] = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    const muscleGroups:string[] = [
        'legs','quads','hammies','chest','triceps','back','biceps','shoulders', 'arms', 'chest_back','chest_tris','chest_bis',
        'back_bis','back_tris','chest_shoulders_tris','chest_shoulders_bis','back_shoulders_tris','back_shoulders_bis', 'bis_tris', 
        'chest_shoulders', 'back_arms'
    ]

    interface ParamsData {
        days:string[]
        muscles:string[]
    }

    // params that get passed to build screen
    // const[buildParams,setParams] = useState<ParamsData[]>([]) //array setup that can be used with setParams(PrevParams=>[...PrevParams,newParams]) if I need to pass more than 1 object
    //initializing empty object for single object param
    const[buildParams,setParams] = useState<ParamsData | null>({
        days:[''], muscles:['']
    })

    //radiobutton 1
    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Yes',
            value: 'option1'
        },
        {
            id: '2',
            label: 'No',
            value: 'option2'
        }
    ]), []);

    
    //radiobutton 2
    const radioBtnDaysSelect = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: '3 Days',
            value: '3'
        },
        {
            id: '2',
            label: '4 Days',
            value: '4'
        },
        {
            id: '3',
            label: '5 Days',
            value: '5'
        },
    ]), []);

    const Animation1 = () =>{

        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            await new Promise(resolve => setTimeout(resolve, 500));
            log.debug('animation complete')
        });
       
    }
    const Animation2 = () =>{

        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            await new Promise(resolve => setTimeout(resolve, 500));
            log.debug('animation complete')
        });
       
    }
    /** TEMPLATE SECTION ******************************************
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */
    const [daysReturn, setDaysReturn] = useState<boolean>(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [value, setValue] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [muscleGroupsArr,setMuscleGroups] = useState<number[]>([])
    const [selectedDays, setSelectedDays] = useState<string | undefined>(); //radiobutton 2, days selection for predefined template menu

    interface PreDefinedTemplates{
        label:string
        value:string
        muscleGroups:number[]
        days:number[]//setting days as a number to then later access from an array based on the index 0-6
    }

    ///MODIFIY ALL THESE TO include muscleGroupsByName and muscleGroupsByNum (idk if i actually need this)

    const ThreeDayTemplateArray:PreDefinedTemplates[] = [
        {label:'Legs, Chest/back, Arms', value:'0', muscleGroups:[0, 9, 8],days:[1, 3, 5]}
    ]
    const FourDayTemplateArray:PreDefinedTemplates[] = [
        {label:'Legs, Chest/back, Arms, Legs', value:'0', muscleGroups:[0, 9, 8, 0], days:[1, 2, 4, 5]},
        {label:'Legs, Chest/Shoulders/Tris, Back/Bis, Legs', value:'1', muscleGroups:[0, 14, 12, 0], days:[1, 2, 4, 5]},
        {label:'Legs, Chest/Shoulders/Bis, Back/Tris, Legs', value:'2', muscleGroups:[0, 15, 13, 0], days:[1, 2, 4, 5]},
        {label:'Chest, Back, Arms, Legs', value:'3', muscleGroups:[3, 5, 8, 0], days:[1,2,4,5]},
        {label:'Chest/Back, Bis/Tris, Shoulders, Legs', value:'4', muscleGroups:[9, 18, 7, 0], days:[1,2,4,5]},
        {label:'Legs, Back/Arms, Chest/Shoulders, Legs', value:'5', muscleGroups:[0, 20, 19, 0], days:[1,2,4,5]}

    ]
    const FiveDayTemplateArray:PreDefinedTemplates[] = [
        {label:'Legs, Chest/back, Arms, Shoulders, Legs', value:'0', muscleGroups:[0, 9, 8, 7, 0], days:[1, 2, 3, 4, 5]},
        {label:'Legs, Chest, Back, Arms, Legs', value:'1', muscleGroups:[0, 3, 5, 8, 0], days:[1, 2, 3, 4, 5]},
        {label:'Legs, Chest, Back, Arms, Shoulders', value:'2', muscleGroups:[0, 3, 5, 8, 7], days:[1, 2, 3, 4, 5]},
        {label:'Legs, Chest/Tris, Back/Bis, Shoulders, Legs', value:'3', muscleGroups:[0, 10, 12, 7, 0], days:[1, 2, 3, 4, 5]},
        {label:'Legs, Chest/Bis, Back/Tris, Shoulders, Legs', value:'4', muscleGroups:[0, 11, 13, 7, 0], days:[1, 2, 3, 4, 5]},
        {label:'Legs, Chest/Shoulders, Back, Arms, Legs', value:'5', muscleGroups:[0, 19, 5, 8, 0], days:[1, 2, 3, 4, 5]},
    ]

    const createParams = (days: string, musclesSelected: string) =>{

        // setParams(null) //reset each time NOT needed if singular object e.g. setParams(newParams)

        log.info('creating params:', days, musclesSelected)
        let selectedDays:string[] = []
        //days is the radio button option selected value, 1 is 3 days, 2 is 4 days, 3 is 5 days 
        if(days == '1'){
            selectedDays=['Mon','Weds','Fri']
        }
        if(days == '2'){
            selectedDays=['Mon','Tues','Thurs','Fri']
        }
        if(days == '3'){
            selectedDays=['Mon','Tues','Weds','Thurs','Fri']
        }
        let selectedMuscles:string[] = []
        for(const muscle of musclesSelected){
            //log.info('muscles:', muscle, muscleGroups[muscle])
            const index = parseInt(muscle)
            selectedMuscles.push(muscleGroups[index])
        }

        interface ParamsObject{
            days:string[]
            muscles:string[]
        }
 
        const newParams:ParamsObject = {
            days:selectedDays,
            muscles:selectedMuscles
        }
        log.info('params generated:', newParams)
        setParams(newParams)
    }

    useEffect(()=>{
       
        if(value){
            log.debug('ready to move onto Build')
            Animation1()
        }
        log.debug('selected dropdown value:',value)
        log.debug('selected muscle groups:', muscleGroupsArr)

        for(const muscle of muscleGroupsArr){
            log.debug('index and muscle groups:', muscle, muscleGroups[muscle])
        }


    },[value,muscleGroupsArr])

    /** MANUAL SELECTION SECTIONS **************************************
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

    interface DaysSelectionData{
        days:string[]
        status:boolean[]
    }
    
    //manual selection variables
    const [selectedDaysArr, setSelectedDaysArr] = useState<DaysSelectionData>({
        days:['sunday','monday','tuesday','wednesday','thursday','friday','saturday'], 
        status:[false,false,false,false,false,false,false]
    })


    //days ready means can move onto selecting muscles
    const[DaysReady, setDaysReady] = useState<boolean>(false)
    const[totalDays, setTotalDays] = useState<number>(0)
    const[isGoToMusclesFocused, setIsGotoMusclesFocused] = useState<boolean>(false)
    const[isDaysConfirmed, setDaysConfirmed] = useState<boolean>(false)
    const[MusclesReady, setMusclesReady] = useState<boolean>(false)
    const[totalMuscles,setTotalMuscles] = useState<number>(0)
    const[daysReadyArr, setdaysReadyArr] = useState<number[]>([])
    const[musclesReadyArr,setmusclesReadyArr] = useState<string[]>([])
    //if I ever want to allow smaller or bigger regimens just change these numbers
    const minRegimen:number = 3
    const maxRegimen:number = 5    

    

    interface ObjectPass{
        day?:string
        muscle?:string
        dayNum?:number
        muscleIndex?:number
        status:boolean
    }
       

    const handleCheckbox = (data:ObjectPass) =>{

        //log.debug('data from checkbox:', data)

        //check if 5 muscles have already been selected
        if(totalMuscles == maxRegimen && MusclesReady && data.status && data.muscle){
            log.debug('can no longer select any other muscle')
            return
        }

        //check if 5 days have already been selected
        if(totalDays == maxRegimen && DaysReady && data.status && data.day){
            log.debug('can no longer select any other day')
            return
        }


        //checkbox is checked
        if(data.status){
            //dont need to check if it exists in the array because as soon as checkbox status is false, it should be removed
            if(data.day){
                //has to null check because 0 index will resolve as false
                if(data.dayNum != null){
                const index = data.dayNum
                    //other methods from other pages dont work because this is a specific use case
                    //where i need to update only 1 property in an object and not the other which I haven't done yet
                    setSelectedDaysArr((prev) => {
                        if (!prev.status[index]) { // Check latest prev
                            const newStatus = [...prev.status]; // Copy array
                            newStatus[index] = data.status; // Update specific index
                            return { ...prev, status: newStatus }; // New object with updated status
                        }
                        return prev; // No change if already true
                    })
                    
                    //first check if the item exists
                    if(!daysReadyArr.includes(data.dayNum))
                    setdaysReadyArr([...daysReadyArr, data.dayNum])   

                }
            }

            if(data.muscle){
                //has to null check because 0 index will resolve as false
                if(data.muscleIndex != null){
                    const index = data.muscleIndex
                  
                    const newArr = [...musclesReadyArr]

                    newArr[index] = data.muscle 
                    // log.info('inserted muscle into array at index:',data.muscle, ' :',index)
                    setmusclesReadyArr(newArr)
                }
            }
            
          
        }
        //checkbox is unchecked
        else{

            if(data.day){
                //has to null check because 0 index will resolve as false
                if(data.dayNum != null){
                const index = data.dayNum
                    //other methods from other pages dont work because this is a specific use case
                    //where i need to update only 1 property in an object and not the other which I haven't done yet
                    setSelectedDaysArr((prev) => {
                        if (prev.status[index]) { // Check latest prev status
                            const newStatus = [...prev.status]; // Copy array
                            newStatus[index] = data.status; // Update specific index
                            return { ...prev, status: newStatus }; // New object with updated status
                        }
                        return prev; // No change if already true
                    })
                    

                }

                if(daysReadyArr?.length == 1){
                    setdaysReadyArr([])
                }
                else{
                    if(data.dayNum != null){
                        //create new array that doesn't have the value that equals the value being checked
                        const updatedItems = daysReadyArr.filter((value, arrIndex) => value !== data.dayNum);
                        setdaysReadyArr(updatedItems)
                    }
                }

            }

            if(data.muscle){
                //has to null check because 0 index will resolve as false
                if(data.muscleIndex != null){
                    const index = data.muscleIndex
                  
                    const newArr = [...musclesReadyArr]

                    if(newArr[index] == data.muscle){
                        newArr[index] = ''
                        // log.info('removed muscle from array at index:', data.muscle, ':', index)
                        setmusclesReadyArr(newArr)
                    }

                    // const updatedItems = musclesReadyArr.filter((value, arrIndex) => value !== data.muscle);
                    // setmusclesReadyArr(updatedItems)
                }

            }

        }
    }

    //When move to muscles selection, fill in the empty array with empty strings equal to length of total days selected
    const updateMuscleArray = () =>{
        const newArr = new Array(totalDays).fill('')
        setmusclesReadyArr(newArr)
    }
    //manual selection build the parameters to pass to Build step
    const ManualCreateParms = () =>{

        
        log.warn('selected days ready:', daysReadyArr)
        log.warn('selected muscles ready:', musclesReadyArr)

        interface ParamObject{
            days:string[]
            muscles:string[]

        }

        const daysShortMod:string[] = []
        daysReadyArr.forEach((day) =>{

            const dayname = daysShort[day]
            daysShortMod.push(dayname)
        })


        const buildParam:ParamObject = {days:daysShortMod,muscles:musclesReadyArr}
        setParams(buildParam)
    }

    //sort the days ready array numbers so its always in ascending order for correct day name array indexing
    useEffect(()=>{
        log.debug('days ready array modified:',daysReadyArr)

        if(DaysReady){
            daysReadyArr.sort((a:number,b:number) => a - b);        
        }
    },[daysReadyArr])


    useEffect(()=>{
        log.debug('muscles ready array modified:', musclesReadyArr)
       if(DaysReady){
        if(musclesReadyArr.length == 0){
            const newArr = new Array(totalDays).fill('')
        setmusclesReadyArr(newArr)
        }
       }

       let muscleSelectedCount:number = 0
       musclesReadyArr.forEach((selectedStatus,index) =>{

            if(selectedStatus){

                muscleSelectedCount+=1
                setTotalMuscles(muscleSelectedCount)
            }
        })

        if(muscleSelectedCount == totalDays){
            Animation1() //animate button
            setMusclesReady(true) //set muscles ready which allows moving onto Build step
            ManualCreateParms() //create the parameters to pass to the Build step route via the button params prop
            

        }
        else{
            Animation2()
            log.debug('muscles is no longer ready')
            setMusclesReady(false)
            
        }
    },[musclesReadyArr])


    useEffect(()=>{
        //setmusclesReadyArr([])
        log.debug('total days selected:', totalDays)
        log.debug('total muscles selected:', totalMuscles)
        

    },[totalDays,totalMuscles])

    

    
    useEffect(()=>{
        log.debug('manual selection selected days array status prop values updated:', selectedDaysArr)

        let daySelectedCount:number = 0
        selectedDaysArr.status.forEach((selectedStatus,index) =>{

            if(selectedStatus){

                daySelectedCount+=1
                setTotalDays(daySelectedCount)
            }
        })
       
        if(daySelectedCount >=minRegimen && daySelectedCount <=maxRegimen){
            Animation1()
            setDaysReady(true)
        }
        else{
            Animation2()
            log.debug('days is no longer ready')
            setDaysReady(false)
        }

    },[selectedDaysArr])

    useEffect(()=>{
        if(selectedId){
        const index = parseInt(selectedId) - 1
        
        log.debug('selected value:',radioButtons[index])
        }
        else{
            setdaysReadyArr([])
            setmusclesReadyArr([])
            setSelectedDaysArr({ days:['sunday','monday','tuesday','wednesday','thursday','friday','saturday'], 
            status:[false,false,false,false,false,false,false]})
        }

    },[selectedId])

    useEffect(()=>{
       
        log.info('build params:', buildParams)
        

    },[buildParams])

    useEffect(()=>{
        if(selectedDays){
        log.info(selectedDays)
        const index = parseInt(selectedDays) - 1
        
        log.debug('selected days value:',radioBtnDaysSelect[index])
        }
        else{
            Animation2()
            setValue(null)
        }

    },[selectedDays])

   




    return (

        <View>
            {selectedId == undefined?
                <View>
                <View className='mt-10'>
                    <Text style={{color:themeType.textPrimary}}>Would you like to use pre-defined templates for the days and muscle groups?</Text>
                </View>
                
                <RadioGroup 
                containerStyle={{width:'100%', flex:1, justifyContent:'flex-start', alignItems:'flex-start', marginTop:10}}
                labelStyle={[styles.titleText,{color:themeType.textPrimary}]}
                radioButtons={radioButtons} 
                onPress={setSelectedId}
                selectedId={selectedId}
                />
                <View style={{marginTop:80}}>
                <Text className='text-emerald-500' style={{fontSize:12}}>*Pre-defined template days run on a standard Monday-Friday schedule and do not include weekends!</Text>
                </View>
                </View>:
                    <View>
                   
                        {selectedId && radioButtons[parseInt(selectedId) - 1].id == '1'?(<>
                        <View className='flex w-full items-center'>
                            {/* // PREDEFINED TEMPLATES DROPDOWN */}
                                <View className='flex flex-row items-center mt-10'>
                                        <View style={{width:'20%'}}>
                                        <Pressable  className='items-center' onPressIn={()=>{setOptionReturn(true)}} onPressOut={()=>{setOptionReturn(false), setSelectedId(undefined)}}>
                                        <MaterialIcons style={{marginRight:10}} name="cancel" size={24} color={optionReturn?'lime': themeType.textPrimary} />
                                        </Pressable>
                                        </View>
                                        <View style={{width:'85%'}} className='flex items-start'>
                                        <Text style={{color:themeType.textPrimary, marginLeft:2, fontFamily:'ScienceGothic-Regular'}}>PRE-DEFINED-TEMPLATES</Text>
                                        </View>
                                        
                                    </View>
                                </View>
                                        {/* SELECT HOW MANY DAYS */}
                                        {selectedDays == undefined?
                                                <View>
                                                    <Text className='mt-10 p-2' style={{color:themeType.textPrimary}}>Select the amount of days for this regimen</Text>
                                                    <RadioGroup 
                                                    containerStyle={{width:'100%', flex:1, justifyContent:'flex-start', alignItems:'flex-start', marginTop:10}}
                                                    labelStyle={[styles.titleText,{color:themeType.textPrimary}]}
                                                    radioButtons={radioBtnDaysSelect} 
                                                    onPress={setSelectedDays}
                                                    selectedId={selectedDays}
                                                    />
                                                </View>
                                                :(<>
                                                {/* If amount of days has been selected */}
                                                <View className='mt-10 p-4 flex flex-row items-center justify-between'>
                                                <Text className='text-emerald-500' style={{fontFamily:'ScienceGothic-Regular'}}>{daysCount[parseInt(selectedDays) - 1]}</Text>
                                                    <Pressable  className='items-center' onPressIn={()=>{setDaysReturn(true)}} onPressOut={()=>{setDaysReturn(false), setSelectedDays(undefined)}}>
                                                    <MaterialIcons style={{marginRight:10}} name="cancel" size={24} color={daysReturn?'lime': themeType.textPrimary} />
                                                    </Pressable>
                                                </View>


                                                <View>
                                                <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={{color:themeType.textPrimary}}
                                                selectedTextStyle={{color:themeType.textPrimary}}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                data={selectedDays == '1'? ThreeDayTemplateArray : selectedDays == '2'? FourDayTemplateArray:selectedDays == '3'?FiveDayTemplateArray : []}
                                                placeholder="Select From Templates"
                                                labelField={'label'}
                                                valueField={'value'}
                                                value={value}
                                                containerStyle={{backgroundColor:themeType.headerBg}}
                                                itemContainerStyle={{backgroundColor:themeType.headerBg, borderWidth:1}}
                                                itemTextStyle={{color:'#00bc7d'}}
                                                iconColor='#00bc7d'
                                                activeColor='gray'
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={item => { console.log(item.muscleGroups)
                                                setMuscleGroups(item.muscleGroups)
                                                createParams(selectedDays, item.muscleGroups)
                                                setValue(item.value);
                                                setIsFocus(false);
                                                }}
                                                />
                                                </View> 
                                                <Animated.View
                                                className='mt-10'
                                                style={{opacity:fadeAnim}}
                                                >
                                                <BuilderButton title='BUILD' params={buildParams} regimenCount={0} childRoute='RegimenBuild' navigation={navigation} />
                                                </Animated.View>
                                                {/**END DAY SELECTION FOR PREDFINED TEMPLATE */}
                                                
                                         </>)}
    {/** END PREFINED TEMPLATE*/}</>):(<>

                            {/* //START MANUAL SELECTION
                            // CHECKBOXES FOR DAYS AND MUSCLE GROUPS */}
                            <View>
                                {/* DAYS SECTION IS ACTIVE */}
                                {!isDaysConfirmed?(<>
                                <View className='flex flex-row items-center mt-10'>
                                    <View style={{width:'25%'}}>
                                    <Pressable  className='items-center' onPressIn={()=>{setOptionReturn(true)}} onPressOut={()=>{setOptionReturn(false), setSelectedId(undefined)}}>
                                    <MaterialIcons style={{marginRight:10}} name="cancel" size={24} color={optionReturn?'lime': themeType.textPrimary} />
                                    </Pressable>
                                    </View>
                                    <View style={{width:'75%'}} className='flex items-start'>
                                    <Text style={{color:themeType.textPrimary, marginLeft:2, fontFamily:'ScienceGothic-Regular'}}>SELECT YOUR DAYS</Text>
                                    </View>
                                </View>
                                </>)
                                :
                                (<>
                                <View className='flex flex-row items-center mt-6'>
                                    <View style={{width:'25%'}}>
                                    <Pressable  className='items-center' onPressIn={()=>{setOptionReturn(true)}} onPressOut={()=>{setOptionReturn(false), setDaysConfirmed(false), setDaysReady(true), setIsGotoMusclesFocused(false)}}>
                                    <MaterialIcons style={{marginRight:30}} name="cancel" size={24} color={optionReturn?'lime': themeType.textPrimary} />
                                    </Pressable>
                                    </View>
                                    <View style={{width:'75%'}} className='flex items-start'>
                                    <Text style={{color:themeType.textPrimary, marginLeft:-10, fontFamily:'ScienceGothic-Regular'}}>SELECT YOUR MUSCLES</Text>
                                    </View>
                                </View>
                                
                                </>)
                                
                                //MUSCLE SECTION
                                }

                               
                            </View>
                            <View className='flex justify-center items-center '>
                                {/* DAY SECTION IS ACTIVE */}
                                {!isDaysConfirmed?
                                    (<>
                                    <View className='text-left mt-10'>
                                        {days.map((day, index) =>(
                                            <View key={index} className='p-2 flex flex-row items-center justify-between'>
                                            <Text style={{color:themeType.textPrimary}} className='mr-10'>{day.toUpperCase()}</Text>
                                            {/* IF 5 days havent been selected */}
                                            {DaysReady && totalDays == maxRegimen?
                                                (<>
                                                {selectedDaysArr.status[index]?
                                                    <BuilderSelectCheckbox onDataReceived={handleCheckbox} day={day} dayNum={index} isSelected={true}/>
                                                : <Checkbox
                                                style={{margin:4, padding:10}}
                                                value={undefined}
                                                color='red'
                                                />}                 
                                                
                                                </>)         
                                            :
                                            (<>
                                            <View>
                                            
                                            {selectedDaysArr.status[index]?
                                                    <BuilderSelectCheckbox onDataReceived={handleCheckbox} day={day} dayNum={index} isSelected={true} />

                                            :<BuilderSelectCheckbox onDataReceived={handleCheckbox} day={day} dayNum={index} isSelected={false}/>}
                                            </View>
                                            
                                            
                                            </>)
                                            }
                                            
                                            </View>
                                        ))}
                                </View></>):(<>
                                   {/* // MUSCLE SECTION IS ACTIVE */}
                                  
                                   <View className='h-[78%] w-full' >
                                    <ScrollView className='h-[70%]' style={{paddingLeft:10, paddingRight:10}}>
                                        {daysReadyArr.map((dayNum,index) => (
                                        <View key={index} >
                                            <Text className='p-2 text-lg text-emerald-500' style={{marginTop:5}} >{daysShort[dayNum].toUpperCase()}: 
                                            {musclesReadyArr[index]?
                                                <Text> {musclesReadyArr[index].replace('_','/').toUpperCase()}</Text>
                                            :<Text className='text-red-500'> No Muscle Selected</Text>}
                                            
                                            </Text>
                                            {/* <View className='h-[20%]' style={{paddingBottom:10}}> */}
                                            <View>
                                            {/* styled view if i change my mind later <View className='flex bg-zinc-800 p-2 rounded-lg border-2'> */}
                                            <FlatList
                                                style={{ height:200, borderWidth: 2, borderRadius:5, borderColor:'#00bc7d', padding: 10, shadowColor:'lime', shadowRadius:4,  
                                                shadowOffset:{width:0, height:0},shadowOpacity:.5}} // Matches your className/style
                                                data={muscleGroups} // Your array as data source
                                                keyExtractor={(item, index) => index.toString()} // Unique keys (use item if unique strings)
                                                renderItem={({ item: muscle, index: index2 }) => ( // Destructure for your vars
                                                    <View className='p-2 flex flex-row items-center justify-between'>
                                                    <Text style={{ color: themeType.textPrimary }} className='mr-10'>{muscle.toUpperCase()}</Text>
                                                    {/* Your conditional checkbox logic */}
                                                  
                                                    {musclesReadyArr[index] == '' ? (
                                                        <BuilderSelectCheckbox onDataReceived={handleCheckbox} muscle={muscle} muscleIndex={index} isSelected={false}/>
                                                    ) : musclesReadyArr[index] == muscle ? (
                                                        <BuilderSelectCheckbox onDataReceived={handleCheckbox} muscle={muscle} muscleIndex={index} isSelected={true} />
                                                    ) : (
                                                        <Checkbox style={{ margin: 4, padding: 10 }} value={undefined} color='red' />
                                                    )}
                                                    </View>
                                                )}
                                                //nestedScrollEnabled={true} // Key for Android nested scrolling (if outer is scrollable)
                                                showsVerticalScrollIndicator={false} // Optional: Hide scrollbar if desired
                                                />
                                            </View>
                                         </View>
                                        ))}
                                      
                                       
                                        </ScrollView>
                                        </View>
                                        </>)
                                }
                                        
                           
                                    {/* DAYS SECTION ACTIVE STILL */}
                                    {!isDaysConfirmed?(<>
                                        {!DaysReady?
                                            <View className='mt-10'>
                                            <Text className='text-emerald-500'>*Please select 3 to 5 days to proceed!</Text>
                                            </View>
                                            
                                        : 
                                        
                                        <Animated.View
                                        className='mt-10'
                                        style={{opacity:fadeAnim}}
                                        >
                                        <Pressable onPressIn={()=> setIsGotoMusclesFocused(true)} onPressOut={()=>setIsGotoMusclesFocused(false)} onPress={()=>[setDaysConfirmed(true), updateMuscleArray()]}>
                                        <Text className=' border-2 p-4 rounded-lg' style={{backgroundColor:themeType.headerBg,transform:isGoToMusclesFocused?[{ scale: 1.1 }]: [{scale:1}], color:isGoToMusclesFocused?'lime': '#00bc7d', borderColor:isGoToMusclesFocused?'lime':'#00bc7d'}}>PRESS TO SELECT MUSCLE GROUPS</Text>
                                        </Pressable>
                                        </Animated.View>
                                        }
                                    </>):
                                    //MUSCLES SECTION ACTIVE                                   
                                    
                                    (<>
                                        
                                        {!MusclesReady?
                                            
                                            <View style={{marginLeft:10, marginTop:10}}>
                                            <Text className='text-emerald-500 mt-2'>*Please select 1 muscle group for each day to proceed!</Text>
                                            </View>  
                                        : 
                                        <View className='w-full'>
                                        <Animated.View
                                        className='w-full mt-2'
                                        style={{opacity:fadeAnim}}
                                        >
                                        <BuilderButton title='BUILD' params={buildParams} regimenCount={0} childRoute='RegimenBuild' navigation={navigation} />
                                        </Animated.View>
                                        </View>
                                        }
                                        
                                    
                                    </>)
                                    
                                    }
                                        
                                
                              
                            </View>
                            
                            
                            </>) }
                    
                    </View>
                }
        </View>
    )

}

export default RegimenSelect

const styles = StyleSheet.create({

    container:{
        //backgroundColor:'rgba(3, 252, 20, 1)',
        padding:10
    },
    titleText:{
        textAlign:'center',
        fontSize:12,
        fontFamily:'ScienceGothic-Regular'
    },
    dropdown: {
        margin: 16,
        height: 50,
        width:300,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      icon: {
        marginRight: 5,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
})