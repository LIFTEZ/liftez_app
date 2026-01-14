import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import log from '@/src/utils/Logger';


interface ObjectPass{
    status:boolean
    exercise:string
    index:number
    checkboxIndex:number
}

interface BuildProps{
    exercise:string
    filteredExerciseStatus:boolean //this is the status of the exercise connected to the current checkbox while filtered
    muscle:string
    exerciseFromArray:string
    filter:string
    filterStatus:boolean
    statusFromArray:boolean
    index:number
    checkboxIndex:number
    exerciseIndex:number
    onDataReceived: (data: ObjectPass) => void

  
}


const BuilderCheckbox = ({exercise, filteredExerciseStatus, exerciseFromArray, filter, filterStatus, statusFromArray, index, muscle, checkboxIndex, exerciseIndex, onDataReceived}: BuildProps) => {


  const [isChecked, setChecked] = useState<boolean | undefined>(undefined);

  const sendDataToParent = (status: boolean, exercise:string, index:number, checkboxIndex:number) => {
    const dataToSend = {status:status, exercise:exercise, index:index, checkboxIndex:checkboxIndex}
    // Call the function passed from the parent with the data
    onDataReceived(dataToSend);
  };

  useEffect(()=>{

    if(isChecked != undefined){
        if(isChecked){
        log.debug('this checkbox is checked for this exercise:', exercise)
        }
        else{
        log.debug('this exercise was unselected:', exercise)
            
        }
        sendDataToParent(isChecked, exercise,index,checkboxIndex)
    }
  },[isChecked])


  useEffect(()=>{

    if(filter){
         //THE ORIGINAL EXERCISE TIED TO THE CHECKBOX INDEX IS SELECTED
        if(statusFromArray){

            log.info(`---------START CHECKBOX LOG FROM BUILDERCHECKBOX && FILTER ACTIVE---------CHECKBOX:${checkboxIndex}-----------------------`)
            // log.debug('muscle:', muscle)
            // log.debug(`exercise selected status, if true, checkbox ${checkboxIndex} should be checked:`, statusFromArray)
            // log.debug('the actual exercise connected to this checkbox index is:', exerciseFromArray)
            // log.debug('the current exercise being filtered that is borrowing this checkbox is:', exercise)
            // log.debug('the actual index of the exercise borrowing the checkbox is:', exerciseIndex)
            
            //early return if the actual exercise is empty
            if(exerciseFromArray == ''){
                setChecked(false)
                return
            }
            
            //CHECK IF THE INDEXES DO NOT MATCH
            if(checkboxIndex != exerciseIndex){

                //check if the filtered exercise has been selected or not
                if(filteredExerciseStatus){
                    log.debug('the indexes do not match, but this exercise is set to true so this checkbox should be checked')
                    setChecked(true)
                }
                else{
                log.debug('the indexes do not match, setting checkbox to false')
                setChecked(false)
                log.debug('status of this actual exercise:', filteredExerciseStatus)
                return
                }
            }
            else{
                log.debug('setting this exercise to true:',exercise)
                setChecked(true)
            }
           
        }
        //THE ORIGINAL EXERCISE TIED TO THE CHECKBOX INDEX IS NOT SELECTED YET
        else{
            log.info('the exercise that is originally connected to this checkbox prefilter has not been selected:', checkboxIndex)
            //check if the exercise borrowing this checkbox already selected
            if(filteredExerciseStatus){
                setChecked(true)
            }
        }
        log.info(`---------END CHECKBOX LOG FROM BUILDERCHECKBOX && FILTER ACTIVE----------CHECKBOX:${checkboxIndex}---------------------`)
    }
    else{
        log.info(`---------START CHECKBOX LOG FROM BUILDERCHECKBOX---------CHECKBOX:${checkboxIndex}-----------------------`)
        log.debug('from checkbox, filter is not present')
        log.debug(`exercise selected status, if true, checkbox ${checkboxIndex} should be checked:`, statusFromArray)
        if(exerciseFromArray)
        log.debug('the actual exercise connected to this checkbox index is:', exerciseFromArray)
        log.debug('the actual index for this exercise:', exerciseIndex)

        //this is firing when it shouldnt
        if(statusFromArray  && checkboxIndex == exerciseIndex){
            setChecked(true)
        }else{
            setChecked(false)
        }
        log.info(`---------END CHECKBOX LOG FROM BUILDERCHECKBOX && FILTER ACTIVE----------CHECKBOX:${checkboxIndex}---------------------`)
    }
     

  },[exerciseFromArray,filter])

// NOT READY FOR THIS YET
//   useEffect(()=>{

//        if(filter){
//         log.debug('filter is present from checkbox:', checkboxIndex)
//        }
//        else{
//         log.debug('filter is not present from checkbox:', checkboxIndex)
//         log.debug('actual status from array:', statusFromArray)
//         if(statusFromArray){
//             if(isChecked !== statusFromArray){
//                 setChecked(statusFromArray)
//             }
//         }
//        }
//   },[filter])

  return (
    <View>

      <View>
        <Checkbox
          style={styles.checkbox}
          value={isChecked ?? undefined}
          onValueChange={setChecked}
          disabled={filterStatus ? true:false}
          color={isChecked ? '#00bc7d' : undefined}
        />
   
      </View>

    </View>
  );
}

export default BuilderCheckbox

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 4,
    padding:10,
  },
});