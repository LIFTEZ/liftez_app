import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import log from '@/src/utils/Logger';


interface ObjectPass{
    day?:string
    muscle?:string
    status:boolean
}

interface BuildProps{
    day?:string
    muscle?:string
    muscleIndex?:number
    dayNum?:number
    isSelected?:boolean
    onDataReceived: (data: ObjectPass) => void

  
}


const BuilderSelectCheckbox = ({day,dayNum, isSelected, muscle, muscleIndex, onDataReceived}: BuildProps) => {


  const [isChecked, setChecked] = useState<boolean | undefined>(undefined);

  const sendDataToParent = (status:boolean, day?:string, dayNum?:number, muscle?:string, muscleIndex?:number) => {
    const dataToSend = {status:status, day:day, dayNum:dayNum, muscle:muscle, muscleIndex:muscleIndex}
    // Call the function passed from the parent with the data
    onDataReceived(dataToSend);
  };


  useEffect(()=>{

        if(isSelected){
            setChecked(true)
        }
        else{
            setChecked(false)
        }

  },[isSelected])


  useEffect(()=>{

    if(isChecked != undefined){
        // if(isChecked){
        // log.debug('this checkbox is checked for this day:', exercise)
        // }
        // else{
        // log.debug('this day was unselected:', exercise)
            
        // }
        if(muscle)
        {
            sendDataToParent(isChecked, day, dayNum, muscle, muscleIndex)
        }
        else{
            sendDataToParent(isChecked, day, dayNum)
        }
       
    }
  },[isChecked])


  return (
    <View>

      <View>
        <Checkbox
          style={styles.checkbox}
          value={isChecked ?? undefined}
          onValueChange={setChecked}
          color={isChecked ? '#00bc7d' : undefined}
        />
     
      </View>

    </View>
  );
}

export default BuilderSelectCheckbox

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