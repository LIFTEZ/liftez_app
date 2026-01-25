import { useState,useEffect, useLayoutEffect, useRef } from 'react';
import {View,Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from '@/src/utils/Logger';
import { useTheme } from '@/src/ThemeContext';
import { RootStackParamList } from '@/src/types';
import { NavigationProp, Route, RouteProp } from '@react-navigation/native';
import EmailRegimen from './Forms/EmailRegimen';
import BuilderButton from './Buttons/BuilderButton';



//regimenitem components imports
import RegimenItem from './RegimenItem';



interface RouteProps{
    navigation:NavigationProp<any>
    route:RouteProp<RootStackParamList, 'RegimenMain'>
}



const RegimenMain = ({navigation, route }: RouteProps) =>{

    /** REGIMENMAIN variables and functions
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
     * 
     * 
     * 
     * 
     */

    const{themeType} = useTheme()

   
    const[RegimenCount, setRegimenCount] = useState<number>(0) //set to 1 for faster debugging and developing purposes
   


    interface Data{
        id:string
        key:string
    }
    
    const[regimenKeys, setRegimenKeys] = useState<Data[]>([
       
    ])

    interface deleteData{
        status:boolean
    }

    //check if child (regimen/regimenitem) was deleted
    const handleDelete = (data: deleteData) =>{
        if(data.status){
            //update total regimens
            getTotalRegimens()
        }
    }
   
    //item:regimen works or item alone, CANNOT do just regimen and regimen:Data, doesn't work like that
    const renderItem = ({item:regimen}:{item: Data}) =>{
        return(
            <View>
            {regimen.key == 'Regimen_0'?<Text className='text-emerald-500 mb-2 font-bold' style={{fontSize:10}}>
            **SWIPE LEFT FOR OPTIONS**
            </Text>:null}
            <RegimenItem  regimenkey={regimen.key} didDelete={handleDelete}/>     
            </View>       
        )
    }

    //debug purposes
    // useEffect(()=>{
    //     console.log('regimen keys array:',regimenKeys)
    // },[regimenKeys])

    const getTotalRegimens = async () =>{

            //get all regimen keys
            const keys = await AsyncStorage.getAllKeys()
            log.debug(keys)

            
            let sortedArray:Array<string> = []
           
            let count:number = 0
            for(const key of keys){

                if(key.includes('Regimen_')){
                    log.debug(key)
                    count+=1
                    if(!sortedArray.includes(key))
                    sortedArray.push(key)
                    //also call another function
                }
            }

            //intially sort the keys array
            sortedArray.sort((a, b) => {
                return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
              });
              //console.log('sorted array:',sortedArray)

            //structure required for the regimenitem renderitem array object
              interface Data{
                id:string
                key:string
            }

            //this is the final array to actually push to the useState variable
            let dataArray:Data[] = []

            sortedArray.forEach((value,index) =>{
                dataArray.push({id:index.toString(), key:value})
            })
            setRegimenKeys(dataArray)
            setRegimenCount(count)
        

    }

    useEffect(()=>{

       getTotalRegimens()
        
       
    },[navigation])

    //get the bottom tabbar back, regimen builder removes it
    useLayoutEffect(()=>{
         
            navigation.getParent()?.setOptions({
                tabBarStyle: { position: 'absolute', height:60, backgroundColor:themeType.headerBg, borderTopColor:'transparent'},
            })
        
    },[navigation, themeType])
    

    return(

        <View>
            {RegimenCount == 0?
                <View className='w-full flex justify-center items-center'>
                    <Text style={{color:themeType.textPrimary}}>No Regimens found*</Text>
                    <Text style={{color:themeType.textPrimary}} className='mt-10 p-2'>*Click the button below to build your first regimen!</Text>
                </View>
            // display the regimens in a flatlist and render its own component because it will need different functionalities
            // render component will be editable and downloadable (convert to pdf) and also can email from here as well
            : <View className=''>
                {/* FLATLIST */}
                <View className='p-4'>
                <Text className='text-emerald-500 mb-2 font-bold'>
                    TOTAL REGIMENS: {RegimenCount}
                </Text>
                </View>
                {/* REGIMENITEM FLATLIST COMPONENT */}
                <FlatList
                    scrollEventThrottle={16}
                    className='h-[70%] p-2'
                    data={regimenKeys}
                    renderItem={renderItem}
                    keyExtractor={(regimen) =>  regimen.id}
                
                
                />  
                </View>}


       
                {/* this fixed height is gonna change once flatlist is added with its own fixed height */}
            <View className='flex w-full justify-end' style={{height:RegimenCount == 0? '75%': '10%'}}>
                <BuilderButton title='Build Regimen' regimenCount={RegimenCount} childRoute='RegimenSelect' navigation={navigation} route={route}/>
            </View>
        
        </View>
    


    )

}

export default RegimenMain


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
        padding: 20,
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

})