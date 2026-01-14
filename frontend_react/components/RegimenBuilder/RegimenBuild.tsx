import { NavigationProp, RouteProp } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RegimenBuildParamList } from "@/src/types";
import { CreateParams } from "@/src/types";
import {ScrollView,View, Pressable, Text, StyleSheet, TextInput,Animated,Modal,Alert} from 'react-native'
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/src/ThemeContext";
import BuilderCheckbox from "./BuilderCheckbox";
import log from "@/src/utils/Logger";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BuilderButton from "../Buttons/BuilderButton";
import debounce from 'lodash.debounce'

// type RootStackParamList = {
//     Main: {entryStorageKey?:string}; // Main screen takes no parameters
//     Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
//     RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
//     RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
// };

// type FullParams = RegimenBuildParamList & RootStackParamList

interface ParamsData {
    days:string[] | undefined
    muscles:string[] | undefined
    prevRoute?:string
    prevRouteParams?: CreateParams
}

interface RouteProps{
    params:ParamsData | undefined
    navigation:NavigationProp<any>
    route:RouteProp<RegimenBuildParamList, 'RegimenBuild'>
}


type RootStackParamList = {
    Main: {entryStorageKey?:string}; // Main screen takes no parameters
    Edit: {storagekey: string} // Edit screen takes a string which will be the unique storage key ID
    RegimenMain: undefined //Regimens main screen that stores your regimens you create in Regimen builder and provides other options
    RegimenBuildMain: undefined //Secondary screen to RegimenMain that allows you to build your own regimen with a super clean custom form
};

type FullParams = RegimenBuildParamList & RootStackParamList


type RegimenBuildProps =  RouteProps & NativeStackScreenProps<FullParams, 'RegimenBuild'>;

const RegimenBuild = ({params,navigation, route}: RegimenBuildProps) =>{
    
    //this doesnt work yet because it hasnt been passed from BuildScreen
    const prevRoute = params?.prevRoute
    const{themeType} = useTheme()
    //modal visible variable
    const[isVisible, setIsVisible] = useState<boolean>(false)
    //modal close button variable
    const[isBtnFocused,setIsBtnFocused] = useState<boolean>(false)
    //notif modal
    const[isNotif, setIsNotif] = useState<boolean>(false)
    const[notifMsg, setNotifMsg] = useState<string>('')
    const fadeAnimNotif = useRef(new Animated.Value(0)).current;
    //text input
    const[isTextEditing, setIsTextEditing] = useState<boolean[]>([])
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const[days, setDays] = useState<string[] | undefined>([])
    const[muscles, setMuscles] = useState<string[] | undefined>([])

    interface ExerciseObj{
        id:number
        status:boolean[] 
        exercise: string[]
       
    }

    //EMPTY INITIALIZED FILLED IN WITH USEEFFECT
    const [selectedExercisesArr, setSelectedExercisesArr] = useState<ExerciseObj[]>([])
    //EMPTY INITIALIZED FILLED IN WITH USEEFFECT
    const[isCollapsed, setIsCollapsed] = useState<boolean[]>([])
    //EMPTY INITIALIZED FILLED IN WITH USEEFFECT
    const[totalExercisePerGroup, setTotalExercisesPerGroup] = useState<number[]>([])

    useEffect(()=>{
            if(params?.prevRouteParams){
                const days = params.prevRouteParams.fullSelection.days
                const muscles = params.prevRouteParams.fullSelection.muscles
                setDays(days)
                setMuscles(muscles)
                setSelectedExercisesArr(params.prevRouteParams.fullBuild)
                setTotalExercisesPerGroup(params.prevRouteParams.totalExercises)

            }else{
            const days = params?.days
            const muscles = params?.muscles
            setDays(days)
            setMuscles(muscles) 
            }
    },[params])

    interface Exercises{
        [key: string]: string[]; // Index signature for dynamic access, allows exercises[selectedMuscles[index]] to not give an error
    }

    //OBJECT ARRAY OF EXERCISES
    const exercises:Exercises = { 
        legs:[
        'barbell squats',
        'barbell front squats',
        'barbell sumo squats',
        'barbell box squats',
        'barbell calve raises',
        'barbell close stance squats',
        'barbell lunges',
        'barbell reverse lunges',
        'goodmornings',
        'barbell SLDs',
        'goblet squats',
        'sissy squats',
        'dumbbell walking lunges',
        'dumbbell SLDs',
        'dumbbell side lunges',
        'bulgarian split squats',
        'leg press',
        'leg press close stance',
        'leg press wide stance',
        'single leg leg press',
        'leg press calve raises',
        'machine leg press',
        'hacksquat',
        'pendulum squat',
        'smith machine squats',
        'smith machine goodmornings',
        'smith machine SLDS',
        'smith machine calve raises',
        'machine standing calve raises',
        'seated calve raises',
        'leg curls',
        'reverse leg curls',
        'single leg leg curls',
        'dumbbell leg curls',
        'cable leg curls (requires ankle strap)',
        'cable kickbacks (requires ankle strap)',
        'cable adductors (requires ankle strap)',
        'cable abductors (requires ankle strap)',
        'cable knee raises (requires ankle strap)',
        'machine abductors',
        'machine adductors',
        'leg extensions',
        'single leg leg extensions',
        'ab rollouts',
        'hanging leg raises',
        'boats/holds',
        'fifer scissors',
        'russian twists',
        'sit ups',
        'crunches',
        'cable crunches',
        'cable lumberjacks',
        'crunchy frogs',
        'heals to the heaven',
        'oblique raises',
        ],
        quads:[
        'barbell squats',
        'barbell front squats',
        'barbell box squats',
        'barbell close stance squats',
        'barbell lunges',
        'barbell reverse lunges',
        'goblet squats',
        'sissy squats',
        'dumbbell walking lunges',
        'dumbbell side lunges',
        'bulgarian split squats',
        'leg press',
        'leg press close stance',
        'single leg leg press',
        'machine leg press',
        'hacksquat',
        'pendulum squat',
        'smith machine squats',
        'cable adductors (requires ankle strap)',
        'cable abductors (requires ankle strap)',
        'machine abductors',
        'machine adductors',
        'leg extensions',
        'single leg leg extensions',
        'ab rollouts',
        'hanging leg raises',
        'boats/holds',
        'fifer scissors',
        'russian twists',
        'sit ups',
        'crunches',
        'cable crunches',
        'cable lumberjacks',
        'crunchy frogs',
        'heals to the heaven',
        'oblique raises',
        ],
        hammies:[
        'barbell squats',
        'barbell sumo squats',
        'goodmornings',
        'leg press wide stance',
        'leg press',
        'leg curls',
        'smith machine squats',
        'smith machine goodmornings',
        'smith machine SLDS',
        'leg curls',
        'reverse leg curls',
        'single leg leg curls',
        'dumbbell leg curls',
        'hyperextensions',
        'cable rope hyperextensions',
        'cable leg curls (requires ankle strap)',
        'cable kickbacks (requires ankle strap)',
        'cable adductors (requires ankle strap)',
        'cable abductors (requires ankle strap)',
        'cable knee raises (requires ankle strap)',
        'machine abductors',
        'machine adductors',
        'ab rollouts',
        'hanging leg raises',
        'boats/holds',
        'fifer scissors',
        'russian twists',
        'sit ups',
        'crunches',
        'cable crunches',
        'cable lumberjacks',
        'crunchy frogs',
        'heals to the heaven',
        'oblique raises',
        ],
        chest:[
        'barbell bench',
        'barbell incline bench',
        'barbell decline bench',
        'dumbbell bench press',
        'incline dumbbell bench press',
        'decline dumbbell bench press',
        'dumbell flys',
        'incline dumbbell flys',
        'standing cable flys',
        'bench cable flys',
        'single arm cable fly',
        'hammer strength chest press',
        'machine chest flys',
        'machine dips',
        'dips',
        'pushups',
        'incline pushups',
        'diamond pushups',
        'one-handed pushups',
        ],
        triceps:[
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups',
        ],
        back:[
        'barbell row',
        'underhand barbell row',
        'landmine/t-bar rows',
        'lawnmowers',
        'dumbbell pullovers',
        'machine pullovers',
        'hammer strength rows',
        'bentover dumbbell rows',
        'cable seated v-bar rows',
        'lat pulldowns',
        'single arm lat pulldown',
        'standing lat pushdowns',
        'rackpulls',
        'deadlifts',
        'hyperextensions',
        'pullups',
        'chin ups',
        'behind neck pullups'
        ],
        biceps:[
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        ],
        shoulders:[
        'seated dumbbell press',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises'        
        ],
        arms:[
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups',
        'seated dumbbell press',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises',
        'dumbbell reverse grip curls',
        'dumbbell wrist curls',
        'dumbbell reverse grip wrist curls',
        'barbell reverse grip curls',
        'barbell wrist curls',
        'barbell reverse grip wrist curls',
        'cable wrist curls (top)',
        'cable wrist curls (bottom)',
        'cable behind back wrist curls',
        'cable reverse grip wrist curls',
        'forearm wrist twists',
        'wrist rollers',
        ],
        chest_back:[
        'barbell bench',
        'barbell incline bench',
        'barbell decline bench',
        'dumbbell bench press',
        'incline dumbbell bench press',
        'decline dumbbell bench press',
        'dumbbell flys',
        'incline dumbbell flys',
        'standing cable flys',
        'bench cable flys',
        'single arm cable fly',
        'hammer strength chest press',
        'machine chest flys',
        'pushups',
        'incline pushups',
        'diamond pushups',
        'one-handed pushups',
        'barbell row',
        'underhand barbell row',
        'landmine/t-bar rows',
        'lawnmowers',
        'dumbbell pullovers',
        'machine pullovers',
        'hammer strength rows',
        'bentover dumbbell rows',
        'cable seated v-bar rows',
        'lat pulldowns',
        'single arm lat pulldown',
        'standing lat pushdowns',
        'rackpulls',
        'hyperextensions',
        'pullups',
        'chin ups',
        'behind neck pullups'
        ],
        chest_tris:[
        'barbell bench',
        'barbell incline bench',
        'barbell decline bench',
        'dumbbell bench press',
        'incline dumbbell bench press',
        'decline dumbbell bench press',
        'dumbbell flys',
        'incline dumbbell flys',
        'standing cable flys',
        'bench cable flys',
        'single arm cable fly',
        'hammer strength chest press',
        'machine chest flys',
        'pushups',
        'incline pushups',
        'diamond pushups',
        'one-handed pushups',
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups',
        ],
        chest_bis:[
        'barbell bench',
        'barbell incline bench',
        'barbell decline bench',
        'dumbbell bench press',
        'incline dumbbell bench press',
        'decline dumbbell bench press',
        'dumbbell flys',
        'incline dumbbell flys',
        'standing cable flys',
        'bench cable flys',
        'single arm cable fly',
        'hammer strength chest press',
        'machine chest flys',
        'pushups',
        'incline pushups',
        'diamond pushups',
        'one-handed pushups',
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        ],
        back_bis:[
        'barbell row',
        'underhand barbell row',
        'landmine/t-bar rows',
        'lawnmowers',
        'dumbbell pullovers',
        'machine pullovers',
        'hammer strength rows',
        'bentover dumbbell rows',
        'cable seated v-bar rows',
        'lat pulldowns',
        'single arm lat pulldown',
        'standing lat pushdowns',
        'rackpulls',
        'hyperextensions',
        'pullups',
        'chin ups',
        'behind neck pullups',
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        ],
        back_tris:[
        'barbell row',
        'underhand barbell row',
        'landmine/t-bar rows',
        'lawnmowers',
        'dumbbell pullovers',
        'machine pullovers',
        'hammer strength rows',
        'bentover dumbbell rows',
        'cable seated v-bar rows',
        'lat pulldowns',
        'single arm lat pulldown',
        'standing lat pushdowns',
        'rackpulls',
        'hyperextensions',
        'pullups',
        'chin ups',
        'behind neck pullups',
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups',   
        ],
        chest_shoulders_tris:[
        'barbell bench',
        'barbell incline bench',
        'barbell decline bench',
        'dumbbell bench press',
        'incline dumbbell bench press',
        'decline dumbbell bench press',
        'dumbbell flys',
        'incline dumbbell flys',
        'standing cable flys',
        'bench cable flys',
        'single arm cable fly',
        'hammer strength chest press',
        'machine chest flys',
        'pushups',
        'incline pushups',
        'diamond pushups',
        'one-handed pushups',
        'seated dumbbell press',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises',
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups', 
        ],
        chest_shoulders_bis:[
        'barbell bench',
        'barbell incline bench',
        'barbell decline bench',
        'dumbbell bench press',
        'incline dumbbell bench press',
        'decline dumbbell bench press',
        'dumbbell flys',
        'incline dumbbell flys',
        'standing cable flys',
        'bench cable flys',
        'single arm cable fly',
        'hammer strength chest press',
        'machine chest flys',
        'pushups',
        'incline pushups',
        'diamond pushups',
        'one-handed pushups',
        'seated dumbbell press',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises',   
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        ],
        back_shoulders_tris:[
        'barbell row',
        'underhand barbell row',
        'landmine/t-bar rows',
        'lawnmowers',
        'dumbbell pullovers',
        'machine pullovers',
        'hammer strength rows',
        'bentover dumbbell rows',
        'cable seated v-bar rows',
        'lat pulldowns',
        'single arm lat pulldown',
        'standing lat pushdowns',
        'rackpulls',
        'hyperextensions',
        'pullups',
        'chin ups',
        'behind neck pullups',
        'seated dumbbell press',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises',
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups',
        ],
        back_shoulder_bis:[
        'barbell row',
        'underhand barbell row',
        'landmine/t-bar rows',
        'lawnmowers',
        'dumbbell pullovers',
        'machine pullovers',
        'hammer strength rows',
        'bentover dumbbell rows',
        'cable seated v-bar rows',
        'lat pulldowns',
        'single arm lat pulldown',
        'standing lat pushdowns',
        'rackpulls',
        'hyperextensions',
        'pullups',
        'chin ups',
        'behind neck pullups',
        'seated dumbbell press',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises',
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        ],
        bis_trips:[
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups',  
        ],
        chest_shoulders:[
        'barbell bench',
        'barbell incline bench',
        'barbell decline bench',
        'dumbbell bench press',
        'incline dumbbell bench press',
        'decline dumbbell bench press',
        'dumbbell flys',
        'incline dumbbell flys',
        'standing cable flys',
        'bench cable flys',
        'single arm cable fly',
        'hammer strength chest press',
        'machine chest flys',
        'pushups',
        'incline pushups',
        'diamond pushups',
        'one-handed pushups',
        'seated dumbbell press',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises',     
        ],
        back_arms:[
        'barbell row',
        'underhand barbell row',
        'landmine/t-bar rows',
        'lawnmowers',
        'dumbbell pullovers',
        'machine pullovers',
        'hammer strength rows',
        'bentover dumbbell rows',
        'cable seated v-bar rows',
        'lat pulldowns',
        'single arm lat pulldown',
        'standing lat pushdowns',
        'rackpulls',
        'hyperextensions',
        'pullups',
        'chin ups',
        'behind neck pullups',
        'dumbbell bicep curls',
        'dumbbell hammer curls',
        'seated dumbbell curls',
        'seated incline dumbbell curls',
        'concentration curls',
        'preacher curls',
        'machine preacher curls',
        'single arm preacher curls',
        'barbell curls',
        'cable single arm curls',
        'cable straight bar curls',
        'cable concentration curls',
        'cable rope hammer curls',
        'cable underhand grip skullcrushers',
        'cable overhead curls',
        'chin ups',
        'dumbbell single arm overhead ext..',
        'dumbbell behind neck ext..',
        'dumbbell bench across chest tri ext..',
        'dumbbell katanas',
        'dumbbell kickbacks',
        'dumbbell chest press',
        'barbell extensions',
        'barbell skullcrushers',
        'close grip bench press',
        'cable single arm ext..',
        'cable rope ext..',
        'cable rope overhead ext..',
        'cable straight bar ext..',
        'cable straight bar underhand ext..',
        'cable skullcrushers',
        'close stance pushups',
        'arnold press',
        'standing dumbbell press',
        'seated dumbbell lateral raises',
        'seated dumbbell front raises',
        'seated bentover rear delt raises',
        'dumbbell lateral raises',
        'dumbbell front raises',
        'dumbbell behind back raises',
        'dumbbell shrugs',
        'machine shrugs',
        'machine shoulder press',
        'machine rear delt flys',
        'standing barbell press',
        'seated barbell press',
        'behind neck barbell press',
        'barbell shrugs',
        'barbell upright rows',
        'cable behind back lateral raises',
        'cable front raises',
        'cable straight bar raises',
        'facepulls',
        'cable upright rows',
        'cable standing reverse lateral raises',
        'dumbbell reverse grip curls',
        'dumbbell wrist curls',
        'dumbbell reverse grip wrist curls',
        'barbell reverse grip curls',
        'barbell wrist curls',
        'barbell reverse grip wrist curls',
        'cable wrist curls (top)',
        'cable wrist curls (bottom)',
        'cable behind back wrist curls',
        'cable reverse grip wrist curls',
        'forearm wrist twists',
        'wrist rollers',            
        ]

    }

    //TEMP DATA
    const muscleGroups:string[] = [
        'legs','quads','hammies','chest','triceps','back','biceps','shoulders', 'arms', 'chest_back','chest_tris','chest_bis',
        'back_bis','back_tris','chest_shoulders_tris','chest_shoulders_bis','back_shoulders_tris','back_shoulders_bis', 'bis_tris', 
        'chest_shoulders', 'back_arms'
    ]


    interface PreDefinedTemplates{
        label:string
        value:string
        muscleGroupsByNum:number[]
        muscleGroupsByName:string[]
        days:number[]//setting days as a number to then later access from an array based on the index 0-6
    }

    
    interface ObjectPass{
        status:boolean
        exercise:string
        index:number
        checkboxIndex:number
    }

    //NOTIFICATION ANIMATIONS ///////////////////////////////////////////////
    const NotifAnimation1 = () =>{

        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnimNotif, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            await new Promise(resolve => setTimeout(resolve, 500)); 
            log.debug('animation complete')
        });
       
    }
    const NotifAnimation2 = () =>{

        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnimNotif, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start( async ()=>{
            await new Promise(resolve => setTimeout(resolve, 500));  
            log.debug('animation complete')
        });
       
    }

    useEffect(()=>{
            if(isNotif){
                setTimeout(()=>{
                      setIsNotif(false)
                      NotifAnimation2()      
                },2000)  
            }
    },[isNotif])
    
    // Callback function to receive data from the child
    const handleChildData = (data: ObjectPass) => {
        //log.debug('received data from child', data)

        //WHEN RETURN FROM EATING, ORGANIZE THE LOGS BETTER FOR MORE VISBIILITY TO SOLVE THIS FILTERING PROBLEM
        log.info('--------------START CHECKBOX DATA FROM REGIMENBUILD-----------')

        log.debug('data from child:', data)

        const index = data.index
        //const checkboxIndex = data.checkboxIndex 
        //log.debug('checkbox index:', checkboxIndex)


        //START WITH GETTING THE CORRECT INDEX AND NOT USING THE CHECKBOX INDEX
        //get the muscle group
        const muscle = muscles?.[index]
        log.debug('muscle group:', muscle)

        //get the exercises for the muscle group
        const muscleGroupExercises = exercises[muscle!] //exclamation mark asserts that the key is not undefined
        //log.debug('exercises for this muscle group:', muscleGroupExercises)

        //get the correct index for the exercise
        const exerciseIndex = muscleGroupExercises?.indexOf(data.exercise)

        //check if filter for the index is present
        if(filterValues[index]){
            log.debug('filter is present')

                //make sure index matches
                if(index == selectedExercisesArr[index].id){

                    //now check if the exercise exists
                    if(selectedExercisesArr[index].exercise[exerciseIndex!] == data.exercise){
                        log.debug('exercise data exists')

                            //EARLY CHECK IF BOTH STATUS CORRECTINDEX AND DATA.STATUS ARE TRUE
                            //this should fix the checkbox state not being saved which I need to fix later so this 
                         if(selectedExercisesArr[index].status[exerciseIndex!] && data.status){
                           //conditional is only for now to have a solution without checkbox state being fixed
                            return
                        }
                         if(!selectedExercisesArr[index].status[exerciseIndex!] && data.status){
                            // log.debug('this is true:', selectedExercisesArr[index].status[exerciseIndex!], data.status)
                            const newArray = [...totalExercisePerGroup]
                            newArray[index] = newArray[index] + 1
                            setTotalExercisesPerGroup(newArray)
                            //set notification modal usestate variable to true
                            NotifAnimation1()     
                            setIsNotif(true)
                            //display notif message
                            setNotifMsg(`${data.exercise} was added to your regimen!`) 
                        }
                        if(selectedExercisesArr[index].status[exerciseIndex!] && !data.status){
                            const newArray = [...totalExercisePerGroup]
                            if(totalExercisePerGroup[index] != 0)
                            newArray[index] = newArray[index] - 1
                            setTotalExercisesPerGroup(newArray)
                            //set notification modal usestate variable to true     
                            NotifAnimation1()  
                            setIsNotif(true)
                            //display notif message
                            setNotifMsg(`${data.exercise} was removed from your regimen!`) 
                        }
                        log.debug('data exists for this exercise index')
                        // 1. Create a shallow copy of the array
                        const newArray = [...selectedExercisesArr];
                        // 2. update the status each time
                        newArray[index].status[exerciseIndex!] = data.status;
                        // 3. Set the state with the new array
                        setSelectedExercisesArr(newArray)
                        log.info('--------------END CHECKBOX DATA FROM REGIMENBUILD-----------')
                        return

                    }
                    else{
                    
                        log.debug('exercise data does not exist in the array')
                        
                        //EARLY RETURN IF THE CHECKBOX STATUS RECEIVED IS FALSE
                        if(!data.status)
                            return

                        //exercise doesn't exist so that means the value of that index is set to default of '' still
                        //insert the exercise and increment exercise selected count for that muscle group and index

                        // 1. Create a shallow copy of the array
                        const newArray = [...selectedExercisesArr];

                        // 2. Update the value at the specific index in the *new* array
                        newArray[index].exercise[exerciseIndex!] = data.exercise;
                        // 3. update the status as well
                        newArray[index].status[exerciseIndex!] = data.status;
                        // 4. Set the state with the new array
                        setSelectedExercisesArr(newArray)
                        // no check needed for status, increment exercise
                        const newCountArray = [...totalExercisePerGroup]
                        newCountArray[index] = newCountArray[index] + 1
                        setTotalExercisesPerGroup(newCountArray)
                        //set notification modal usestate variable to true
                        NotifAnimation1()       
                        setIsNotif(true)
                        //display notif message
                        setNotifMsg(`${data.exercise} was added to your regimen!`) 
                        log.info('--------------END CHECKBOX DATA FROM REGIMENBUILD-----------')
                        return
                    }   

                }
                else{
                    log.warn('something went wrong with the array')
                    return
                }

        }
        //no filter present
        else{
            log.debug('filter is not present')
            //make sure index matches
            if(index == selectedExercisesArr[index]?.id){

                //check if data exists
                if(selectedExercisesArr[index].exercise[exerciseIndex!] == data.exercise){
                    log.debug('filter not set, data does exist')
                       //EARLY CHECK IF BOTH STATUS CORRECTINDEX AND DATA.STATUS ARE TRUE
                            //this should fix the checkbox state not being saved which I need to fix later so this 
                            if(selectedExercisesArr[index].status[exerciseIndex!] && data.status){
                                //conditional is only for now to have a solution without checkbox state being fixed
                                 return
                             }
                             if(!selectedExercisesArr[index].status[exerciseIndex!] && data.status){
                                 log.debug('this is true:', selectedExercisesArr[index].status[exerciseIndex!], data.status)
                                 const newArray = [...totalExercisePerGroup]
                                 newArray[index] = newArray[index] + 1
                                 setTotalExercisesPerGroup(newArray)
                                //set notification modal usestate variable to true 
                                NotifAnimation1()      
                                setIsNotif(true)
                                //display notif message
                                setNotifMsg(`${data.exercise} was added to your regimen!`) 
                                                    
                             }
                             
                             if(selectedExercisesArr[index].status[exerciseIndex!] && !data.status){
                                 const newArray = [...totalExercisePerGroup]
                                 if(totalExercisePerGroup[index] != 0)
                                 newArray[index] = newArray[index] - 1
                                 setTotalExercisesPerGroup(newArray)
                                 //set notification modal usestate variable to true
                                 NotifAnimation1()       
                                 setIsNotif(true)
                                 //display notif message
                                 setNotifMsg(`${data.exercise} was removed from your regimen!`) 
                             }
                             log.debug('data exists for this exercise index')
                             // 1. Create a shallow copy of the array
                             const newArray = [...selectedExercisesArr];
                             // 2. update the status each time
                             newArray[index].status[exerciseIndex!] = data.status;
                             // 3. Set the state with the new array
                             setSelectedExercisesArr(newArray)
                             log.info('--------------END CHECKBOX DATA FROM REGIMENBUILD-----------')
                             return
                }
                else{
                    log.debug('filter not set, data does not exist')
                    log.debug('exercise data does not exist in the array')
                        
                        //EARLY RETURN IF THE CHECKBOX STATUS RECEIVED IS FALSE
                        if(!data.status)
                            return

                        //exercise doesn't exist so that means the value of that index is set to default of '' still
                        //insert the exercise and increment exercise selected count for that muscle group and index

                        // 1. Create a shallow copy of the array
                        const newArray = [...selectedExercisesArr];

                        // 2. Update the value at the specific index in the *new* array
                        newArray[index].exercise[exerciseIndex!] = data.exercise;
                        // 3. update the status as well
                        newArray[index].status[exerciseIndex!] = data.status;
                        // 4. Set the state with the new array
                        setSelectedExercisesArr(newArray)
                        // no check needed for status, increment exercise
                        const newCountArray = [...totalExercisePerGroup]
                        newCountArray[index] = newCountArray[index] + 1
                        setTotalExercisesPerGroup(newCountArray)
                        //set notification modal usestate variable to true
                        NotifAnimation1()       
                        setIsNotif(true)
                        setNotifMsg(`${data.exercise} was added to your regimen!`) 

                        log.info('--------------END CHECKBOX DATA FROM REGIMENBUILD-----------')
                        return
                }
                
            }else{
                log.warn('something went wrong with the array')
                return
            }
            
        }
        

     
    };

    const [filterValues, setFilterValues] = useState<string[]>([])
    //USING FOR ONBLUR TESTING
    const [filterFinal, setFilterFinal] = useState<string[]>([])

    // Debounced function (runs after typing stops)
    const handleTypingEnded = debounce((index: number) => {
        const newEditting = [...isTextEditing]
        newEditting[index] = false
        setIsTextEditing(newEditting)
        
    }, 1000); 

    //ONBLUR FUNCTION TESTING
    const submitFilterValue = (index:number)=>{

        const text = filterValues[index]
        // copy the array
        const newArray = [...filterFinal];

        // 2. Update the value at the specific index in the *new* array
        newArray[index] = text;

        // 3. Set the state with the new array
        setFilterFinal(newArray);

    }

    const handleFilteredInput = (index:number, text:string)=>{


        if(text == ''){
            const text = filterValues[index]
            // copy the array
            const newArray = [...filterFinal];

            // 2. Update the value at the specific index in the *new* array
            newArray[index] = text;

            // 3. Set the state with the new array
            setFilterFinal(newArray);
        }
       
        const newEditting = [...isTextEditing]
        newEditting[index] = true
        setIsTextEditing(newEditting)

        // copy the array
        const newArray = [...filterValues];

        // 2. Update the value at the specific index in the *new* array
        newArray[index] = text;
    
        // 3. Set the state with the new array
        setFilterValues(newArray);

        log.debug('input text:',filterValues[index])
        log.debug('index passed:', index)

        handleTypingEnded(index)
        

    }
    // Fill the array with empty strings based on length of regimen for filter feature purposes
    useEffect(() => {
        if (muscles) {
          setFilterValues(new Array(muscles.length).fill(''));
          //using for onblur testing
          setFilterFinal(new Array(muscles.length).fill(''));
          setIsTextEditing(new Array(muscles.length).fill(false));
        }
      }, [muscles?.length]); // Re-run if number of muscle groups changes



    useEffect(()=>{
        log.debug('filter value:', filterValues)

    },[filterValues])

    
    useEffect(()=>{

        if(isTextEditing){
            log.warn('text is being edited')
        }
        else{
            log.warn('text is done editting')
        }
},[isTextEditing])

    //toggle collapse function for checkbox list of exercises
    const toggleCollapse = (index:number ) =>{
        // copy the array
        const newArray = [...isCollapsed];

        // 2. Update the value at the specific index in the *new* array
        if(isCollapsed[index]){
            newArray[index] = false
        }
        else{
            newArray[index] = true
        }
        // 3. Set the state with the new array
        setIsCollapsed(newArray);

    }

    //update the selectedExercisesArr properties with null and empty string values up to the length of the exercises for that muscle group
    //this allows the checkboxes to be unique for each index (muscle group) and prevents problems when exercises for 2 different days appear twice like legs being set twice
    const updateExercises = (muscles:string[]) => {
        setSelectedExercisesArr(prevArr => 
          prevArr.map((obj, index) => {
            const muscle = muscles[index];
            const exerciseGroup = exercises[muscle];
            const exerciseGroupLen = exerciseGroup?.length ?? 0;
            return {
              ...obj, // Spread existing
              status: new Array(exerciseGroupLen).fill(false),
              exercise: new Array(exerciseGroupLen).fill('')
            };
          })
        );
      };

    useEffect(()=>{

        //log.info('new array changed:', selectedExercisesArr)
        
    },[selectedExercisesArr])


    useEffect(()=>{

        log.info('filled collpased status array:', isCollapsed)

    },[isCollapsed])
    


    const [isCreateReady, setIsCreateReady] = useState<boolean>(false)

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
            duration: 100,
            useNativeDriver: true,
        }).start( async ()=>{
            await new Promise(resolve => setTimeout(resolve, 500));
            log.debug('animation complete')
        });
       
    }

    //INTERFACES FOR BUILD PARAMS FOR PASSING TO CreateRegimen from BuilderButton

    interface SelectParams{
        days:string[] | undefined
        muscles:string[] | undefined
    }

    interface CreateParams{
        fullBuild:ExerciseObj[]
        fullSelection:SelectParams
        totalExercises:number[]
    }

    const CreatePassParams = () =>{

        const fullParams:CreateParams = {
            fullBuild:selectedExercisesArr,
            fullSelection:{days:days, muscles:muscles},
            totalExercises: totalExercisePerGroup

        }

        return fullParams
    }


    useEffect(()=>{
       
        //log.warn('rebuilding childroute parameters')
        //log.warn('PARAMETERS BUILT:', CreatePassParams())
    },[selectedExercisesArr, isCreateReady])


    useEffect(()=>{
        if(isCreateReady){
            log.info('display exercise selection in modal and button to move onto create:', isCreateReady)
            Animation1()
        }
        else{
            Animation2()
        }
       

    },[isCreateReady])

    useEffect(()=>{

        //check the value of each count
        //CANT WORK ON THIS YET BECAUSE THE COUNTER DOESNT FUNCTION FULLY AS I WANT IT
        //WHEN THE CHECKBOX LOSES ITS CHECKED STATE AND THEN RECHECKS EVEN THO STATUS DOESN'T CHANGE IT STILL INCREMENTS
        let CountCheck:number = 0
        totalExercisePerGroup.forEach((count)=>{

            if(count >= 2){
                CountCheck+=1
            }
            else{
                CountCheck-=1
            }
        })
        log.info('filled total exercises per group count array:', totalExercisePerGroup)
        //IF 2 EXERCISES PER MUSCLE GROUP
        if(CountCheck == totalExercisePerGroup?.length){
            log.info('two exercises per group have been selected')
            setIsCreateReady(true)
        }
        else{
            log.info('two exercises per group have NOT been selected')
            if(isCreateReady)
            setIsCreateReady(false)
        }   
    },[totalExercisePerGroup])

    //trigger on mount with params detected
    useEffect(()=>{

        //fill in array by attribute for each muscle that is passed in params
        if (muscles && muscles.length > 0) {

            //FILL IN ISCOLLAPSED ARRAY WITH FALSES FOR THE LENGTH OF MUSCLES PARAM
            const filledCollapsed = new Array(muscles.length).fill(true)
            setIsCollapsed(filledCollapsed)

            //check if prev route doesn't exist because if it does this logic isn't needed since the array data will exist
            if(!params?.prevRoute){
            //FILL IN TOTAL EXERCISES COUNT PER MUSCLE GROUP ARRAY WITH 0s FOR THE LENGTH OF MUSCLES PARAM
            const filledTotalExercises = new Array(muscles.length).fill(0)
            setTotalExercisesPerGroup(filledTotalExercises)

            //ADD OBJECTS EQUAL TO AMOUNT OF HOW MANY MUSCLE GROUPS/DAYS THERE ARE IN THE REGIMEN
            const newArr = muscles.map((muscle, index) => ({
              id: index, 
              status: [], 
              exercise: [],                 
            }));
           
            setSelectedExercisesArr(newArr); // Set the full array at once
            updateExercises(muscles) //update the status and exercise properties with null and empty values
            }
          }

        
   
    },[params])




    return (
        <View>
            {/* SELECTION NOTIFICATION */}
            <Animated.View
                style={{opacity:fadeAnimNotif, zIndex:10}}
                >
                <View className="flex w-full justify-center items-center" style={{backgroundColor:themeType.screenBg, position:'absolute', top:0}}>
                    <View className="flex justify-center items-center w-[75%] m-4 border-2 rounded-lg" style={{backgroundColor:themeType.screenBg, borderColor:'lime', position:'relative'}}>
                        <Text className="text-emerald-500 p-4 text-center">{notifMsg}</Text>
                    </View>
                </View> 
            </Animated.View>
            {isCreateReady?
            (<>
            
            <Pressable onPress={()=>setIsVisible(true)}>
            <View className="flex w-full flex-row justify-end items-center p-4">
            <Text className="mt-3" style={{color:themeType.textPrimary}}>PRESS TO VIEW YOUR SELECTION </Text>
            <MaterialCommunityIcons className='mt-2' name="list-box-outline" size={24} color="#00bc7d" />
            </View>
            </Pressable>
           
            <View>
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
                                        <Text>{days?.length} DAY REGIMEN</Text>
                                    </View>
                                    <ScrollView className='h-3/4 w-full rounded-b-lg' style={{backgroundColor:themeType.screenBg}}>
                                    {/* <Text className='mt-10' style={[styles.modalText, {color:themeType.textPrimary}]}>{entryValue}</Text> */}
                                            {selectedExercisesArr.map((exercise,index) =>(
                                                <View key={index} className="p-4">
                                                <Text style={{color:'#00bc7d'}}>{days?.[index].toUpperCase()}:{muscles?.[index].replace('_','/').toUpperCase()}</Text>
                                                {Array.from({ length: exercise.exercise.length }, (_, index) => (
                                                <View key={index}>
                                                    {exercise.status[index] == true?
                                                        <Text style={{color:'#00bc7d'}}>  {exercise.exercise[index]}</Text>
                                                    :null}    
                                                </View>
                                                ))}
                                                </View>
                                            ))}
                                   
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
            </View>
            
            </>):
            
               
            
                <View className="mt-4" style={{zIndex:1}} >
                    
                    {/* <Modal 
                    animationType="slide"
                    visible={isNotif}
                    transparent={true}
                    
                    > */}
                    {/* </Modal> */}
                  <Text className="text-md text-center text-emerald-500">*YOU MUST SELECT AT LEAST 2 EXERCISES PER MUSCLE GROUP*</Text>
                  <Text className="text-center text-emerald-500 mt-4" style={{fontSize:10}}>*Core/Abs exercises are included with legs*</Text>
                </View>
                
            }
            <View className="mt-2">          
                <ScrollView className="h-[70%] p-4">
                {muscles?.map((muscle, index) => (

                <View key={index} className="mt-4">
                    <Text style={{color:'#00bc7d'}}>{days?.[index].toUpperCase()}: {muscle.replace('_','/').toUpperCase()}</Text>
                        

                    {exercises?
                    (<>
                    {/* COLLAPSE LOGIC */}                
                    {isCollapsed[index]?
                        // ADD PRESSABLE ON PRESSED TO EXPANND
                        <View>
                            <Pressable onPress={()=>toggleCollapse(index)}>
                            <Text style={{color:themeType.textPrimary}}>Press To View Exercises</Text>
                            </Pressable>
                        </View>
                        :
                        // ADD PRESSABLE ON PRESSED TO COLLAPSE                    
                                (<>
                                <View>
                                    <Pressable onPress={()=>toggleCollapse(index)}>
                                    <Text style={{color:themeType.textPrimary}}>Press To Collapse Exercises</Text>
                                    </Pressable>
                                </View>
                                <TextInput 
                                className="p-2 border-2 rounded-xl mt-2"
                                style={{backgroundColor:themeType.textPrimary2}}
                                value={filterValues[index]} 
                                onChangeText={(text)=> handleFilteredInput(index,text)} 
                                // onBlur={()=>submitFilterValue(index)}
                                inputMode='text' 
                                placeholder="filter by exercise name"
                                />
                        
                                {filterValues[index] == ''?
                                <View>
                            
                                    {exercises[muscle]?.map((exercise, index2) => (
                                        <View key={index2}>
                                            {/* MIGHT HAVE TO CONVERT TO FLATLIST TO APPLY SCROLLING WITHIN THIS LIST */}
                                            {/* <ScrollView> */}
                                                <View className="flex flex-row justify-between items-center p-2">
                                                <Text style={{color:themeType.textPrimary}}> {exercise}</Text>
                                                {/* CHECKBOX COMPONENT THAT TAKES PROP OF EXERCISE */}
                                                <BuilderCheckbox onDataReceived={handleChildData} exercise={exercise} exerciseIndex={exercises[muscle]?.indexOf(exercise)} muscle={muscle} index={index} checkboxIndex={index2} filter={filterValues[index]} filterStatus={isTextEditing[index]}
                                                statusFromArray={selectedExercisesArr[index]?.status[index2]} exerciseFromArray={selectedExercisesArr[index]?.exercise[index2]} filteredExerciseStatus={selectedExercisesArr[index]?.status[exercises[muscle]?.indexOf(exercise)]}/>
                                                </View>
                                            {/* </ScrollView> */}
                                        
                                        </View>
                                    ))}
                                </View>:
                                
                                <View>
                                    {/* choose value you want to filter and then the operation thats how filter() works */}
                                    {/* FILTER DOES NOT SAVE THE CHECKED STATE OF THE CHECKBOXES FOR SOME REASON */}
                                    {exercises[muscle]?.filter((exercise) => exercise.includes(filterValues[index]?.toLowerCase())).map((exercise, index2) => (
                                        <View key={index2}>
                                            {/* <ScrollView className="h-[50%]"> */}
                                                <View className="flex flex-row justify-between items-center p-2">
                                                <Text style={{color:themeType.textPrimary}}> {exercise}</Text>
                                                {/* CHECKBOX COMPONENT THAT TAKES PROP OF EXERCISE */}
                                                <BuilderCheckbox onDataReceived={handleChildData} exercise={exercise} exerciseIndex={exercises[muscle]?.indexOf(exercise)} muscle={muscle} index={index} checkboxIndex={index2} filter={filterValues[index]} filterStatus={isTextEditing[index]}
                                                statusFromArray={selectedExercisesArr[index]?.status[index2]} exerciseFromArray={selectedExercisesArr[index]?.exercise[index2]} filteredExerciseStatus={selectedExercisesArr[index]?.status[exercises[muscle]?.indexOf(exercise)]}/>
                                                </View>
                                            {/* </ScrollView> */}
                                        
                                        </View>
                                    ))}

                                </View>
                                //END FILTER LOGIC
                                } 
                                </>) //END IS NOT COLLAPSED LOGIC
                            //END COLLAPSED CHECK AND LOGIC
                            }  
                        </>) //END IS EXERCISES CHECK
                        :null}
                        

                </View>
                
                    
                
                
                ))}

            
                </ScrollView>
            <View className="">
            <Animated.View
                className='mt-4'
                style={{opacity:fadeAnim}}
                >
                <BuilderButton title="CREATE" buildParams={CreatePassParams()} childRoute="RegimenCreate" navigation={navigation}  />
                </Animated.View>
            </View>
           
            
            {/* <ScrollView className="h-[10%]"> 
                <View className="h-[20%] mt-2">
                <Text style={{color:themeType.textPrimary}}>EXERCISES SELECTED:</Text>
                {selectedExercisesArr.map((exercise,index) =>(
                    <View key={index}>
                    <Text style={{color:themeType.textPrimary}}>{muscles?.[index]}</Text>
                    {Array.from({ length: exercise.exercise.length }, (_, index) => (
                    <View key={index}>
                        {exercise.status[index] == true?
                            <Text style={{color:themeType.textPrimary}}>  {exercise.exercise[index]}</Text>
                        :null}
                       
                       
                    </View>
                    ))}
                   
                    </View>
                ))}
                </View>
                </ScrollView>  */}
            </View>

               

        </View>

    )

}


export default RegimenBuild


const styles = StyleSheet.create({
    //modal styles
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
    //end modal styles
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