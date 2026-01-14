/**
 * SCREENS IN REGIMENBUILDERSTACK FOLDER -----------------------------------------------------------------------------------------------------------------------
 * 
 * CURRENTLY WORKING ON:
 * 
 *  
 *                          
 *                     
 * 
 *   HIGHEST PRORITY 
 *          
 *          
 *          - commit everything once regimen creation complete is successful
 * 
 *          - Build out RegimenMain
 *                  - display regimens as flatlist
 *                  - render regimens as their own component much like entryflatlist
 *                  - allow regimens to be viewed, edited, downloaded, and emailed
 *          - Turn the email modal and logic in RegimenCreate into its own component to be reused in RegimenMain
 * 
 * 
 *          - Add macro command feature to TextArea
 * 
 *          AFTER DONE BUILDING APP 
 *          FIX: 
 *          - filtering exercises and how the checkboxes respond is still a little messed up
 *              - if I select barbell squats and barbell front squats and then 5 of the leg press exercises
 *                     - When i go and filter the word "leg" depending how fast I type it two exercises get added automatically...
 *                              im not sure why this is happening but I need to fix it
 * 
 * 
 * 
 *         
 * 
 * FUTURE:
 * - Go back to TextArea and work on it stylistic wise with new ios styling changes
 * 
 * 
 * COMPLETED - Build Create step component
 *                 COMPLETED - Add conditional notification/indicator that regimen was sent successfully via email
 *                     
 *                 COMPLETED - display built regimen
 *                 COMPLETED - give input option for email to send to someone or self
 *                 COMPLETED - generate pdf option
 *                 COMPLETED - convert PDF to base64 json to pass to AWS proxy function to pass to API gateway call to pass to lambda to send to email via       
 *                 COMPLETED - Add configuration modal for the email settings      
 *                 COMPLETED - create the functions for emailing the regimen and storing it in asyncstorage for local app storage saving and access purposes
 *                   
 *                  
 *                 COMPLETED - Added logic to remove back button and bottom tabbar navigation on create regimen completion
 *                 COMPLETED - Tested the creation function flow with promises
 *                 COMPLETED - Added spinner animation for processing function steps
 * 
 *                 COMPLETED - create terraform resources for Lambda, API gateway, and SES (use examples from neo services or jp portfolio site v2)
 *                             - write the lambda function and package into deployment zip
 *                 RESOLVED/COMPLETED - figure out if i can use BuilderButton component for finish submission to run all the necessary functions and add the regimen to async storage or if
 *                      i use a seperate button for that and then once everything is confirmed successful display FINISH button to go back to main regimen screen
 *                  - on submit return to RegimenMain and save regimen to asyncstorage
 *         
 * 
 * 
 * COMPLETED - create the functions and logic for emailing the regimen and storing it in asyncstorage for local app storage saving and access purposes
 *                COMPLETED  - also need to create the CREATE REGIMEN button which can't be the BuilderButton I believe
 *                  
 *                      COMPLETED - Add name, recip, sender email parameters to payload object
 *                      COMPLETED - deploy terraform resources
 *                      COMPLETED - remove the node modules I have in the api_proxy that im not gonna use and move them to the lambda handler
 *                             COMPLETED - everything I installed in api_proxy for the pdf conversion and email logic needs to be added to lambda handler via pnpm
 *                      COMPLETED - copy the pdf and SES function code from api_proxy and pass to lambda
 *                      COMPLETED - figure out how the data is received by lambda from api gateway whether it needs to be buffered or not
 *                      COMPLETED - return lambda response and promise back to api gateway response
 *                      COMPLETED remove the lambda function code from the proxy and add the api gateway code
 *                      COMPLETED if everything successful
 *                           COMPLETED - Add BuilderButton that navigates the user back to RegimenMain  
 * 
 * 
 * COMPLETED - Add all the exercies to each muscle group in the Build step
 * 
 * COMPLETED - need to fix return from RegimenCreate to RegimenBuild with back button render issue
 * 
 * 
 * COMPLETED PARTIALLY- Figuring out what params need to be passed from RegimenBuild to RegimenCreate to not only proceeed with the Create step functions but also
 *   have enough data to return to RegimenBuild so the component doesn't break and display nothing
 *  
 * 
 * 
 * 
 * - Change the parameters expected from Create step and build it out
 *      - display the regimen, build the regimen into text, store into async on confirm create, generate pdf option, email option
 * - FIX the counter bug on Build step that happens which I'm not even sure what is causing it
 * - Need to change the Alert titles and values on each screen, just has example one for now
 *      - I changed the Build to Select already, will need to do Create next
 * CONTINUE - Adding all the actual exercises to each exercise property in the selectedExercisesArr
 * 
 * 
 * 
 * 
 * 
 * COMPLETED - Before moving onto create, step thru my code and organization for the Select step and make sure i dont have code/variables im not using
 * COMPLETED! - SELECT YOUR MUSCLES MANUAL SELECTION
 *              
 *              
 *                  COMPLETED - implement new checkbox logic for muscle selection
 * 
 * 
 *                  COMPLETED - MODIFY THE FORM TO HAVE THE DAYS SELECTED LISTED IN A COLUMN EACH WITH LIST OF CHECKBOXES
 *                      -this means complete change in logic, only 1 checkbox can be checked per day
 *                      -probably gonna require musclesReadyArr to be an array of objects with key and string value and not just an array of strings
 *                  
 *                  RESOLVED -Muscle selection is fine UNTIL total muscles have been selected and the user wants to modify a day that isn't the last day
 *                      need to 
 *                          A. figure out a way to save that position and know where to insert the next value
 *                          B. change the entire flow and logic of the form such as adding checkboxes for EACH DAY and having those checkboxes required to be selected 
 *                              first before the other checkboxes because visible or enabled, maintain the state of the checked boxes when switching days and 
 *                              have it update the musclesReadyArr accordingly
 *                          Or C. modify the structure of the musclesReadyArr to be an array of objects, each with a key of the day name followed by a string value
 *                                then whenever a checkbox is unselected check where that muscle was selected at and then check where an opening exists in the object
 *                                              - but then the issue rises if 2 checkboxes are unselected the form won't know which day the user wants to actually update first
 * 
 *              
 *                      COMPLETED - create 2 arrays one for days and muscles
 *                      COMPLETED - days array get modified in handleCheckbox function
 *                          COMPLETED BUT DEPRECATED LOGIC -make sure the value from checkbox ALWAYS gets inserted AT the index of the checkbox not just pushed into or the index of the array
 *                                                        -for example if mon tues wed thurs is selected and then user decides to add sun, DO NOT append sun to the end,
 *                                                          append sunday using the index of the checkbox selected which will be 0
 *                                                       - and if the value from checkbox is false remove the value from the array at its index in the array
 *                     COMPLETED - muscles array gets modified in handleCheckbox function
 *                          COMPLETED - same as above except DO NOT insert the muscle at the index of the checkbox, just push it in normally
 *                              - because if the user forgets to select chest which is at index 2, and they want chest for the 4th or 5th day
 *                              - this allows chest to be selected for the 4th or 5th day instead of defaulting to whatever is indexed at 2 in the day array
 * 
 * 
 *                  
 *              COMPLETED - Possibly add the days selected so the user can see which days they selected and the muscle group being selected for that day
 *              COMPLETED- Need to add muscles and checkbox functionality data into handleCheckbox function logic
 *              COMPLETED - need to check for length of selectedMusclesArr statuses and then if equals 5 set MusclesReady to true and run Animation1() if false
 *                 run Animation2()
 * COMPLETED - need to add the muscles and checkboxes
 *   - then combine the data from the daysSelectedArr and musclesSelectedArr and pass as parameter to Build via BuilderButton params
 * 
 * 
 * COMPLETED - Redoing the logic and order for the manual selection
 * 
 
 * COMPLETED - FIX the filtering issue, refer to Notes on iphone app for what is wrong
 * - Create the modal for displaying all the exercises selected in uniform order
 *        COMPLETED  -gotta fix the logic first with finding out if atleast 1 exercise for each muscle group was selected
 *  
 * COMPLETE - Adding collapsible feature to the exercise list
 *      
 * 
 * 
 *
 * 
 * ISSUES:
 * RESOLVED - Filter does not save the state of the checkboxes that are checked
 * 
 *  COMPLETED - Start building the Regimen 
 *  COMPLETED - Creating the forms for both pre-defined template and manual selection
 *    I have the option of doing both forms or establishing the proper passing of the parameter values using the pre-defined
 *    template form first that the build step needs, likely just the actual muscle groups and total days
 *  
 * 
 * TO DO AFTER I COMPLETE THE BUILD STEP:
 * 
 * COMPLETED - Add pre-defined regimens to dropdown for pre-defined templates option
 * COMPLETED - MANUAL SELECTION : Add checkboxes with days selection, when a day is selected add a dropdown or checkbox for the muscle group(s) for that day
 * 
 * 
 * - Going with option of doing one form first, pre-defined because Build step will be the same for both
 *      COMPLETED - Need to create arrays of the exercises for each muscle group and then match them according to what the muscle group value passed from RegimenSelect is
 *      DEPRECATED - Need to also add button to add exercises or an input field that sets how many exercises fields populate either or, both will required a flatlist I believe
 *      - Complete Build step form, figure out how to merge all the data into a single string to pass to RegimenCreate
 *      - return to RegimenSelect and work on the manual selection which will involve checkboxes of checking for each day and then the muscle group combination
 *             - this form data still will and must get passed to Build step in the same format as pre-defined templates
 *               single object {days:[strings of the days selected], muscles:[strings of the muscle groups selected]}
 * 
 * 
 * COMPLETED - Working on the below
 *      Realized three options for how to display the exercises and select them based on the muscle group for the day
 *          - option 1: select exercises dropdown, after exercise is selected, option to add an additional exercise via a button that populates another dropdown
 *          - option 2: confirm the muscle group like in option 1 but display list of the exercises with checkboxes next to them and they can be selected via the checkboxes all at once
 *          - option 3: instead of just regular dropdown use a Multiselect dropdown from the same Dropdown module
 * 
 *        ---Looking like Option 2---
 * 
 * 
 * COMPLETED - Got the checkboxes to work for each individual muscle group uniquely
 * 
 * 
 * 
 * COMPLETED - Establishing the screen navigation order and functionality
 * COMPLETED  - Building out the RegimenContext/Provider
 *    COMPLETED - I need to make it so the provider knows which route it is on and then adjust the visual step indicator per route 
 *      COMPLETED- also need to build the visual step indicator as a component and import it into the RegimenProvider context
 * 
 * COMPLETED - Routing to and from for all the screens in the Regimen Builder 
 *             -learned how to pass parameters via route using form interface from types.tsx
 *
 * COMPLETED (prototype) - Build visual step indicator as a component and import it into RegimenProvider (RegimenContext.tsx)
 * COMPLETED - Add content to RegimenStartScreen.tsx either directly or via component
 *    - this content will consist of a welcome intro and guide/breakdown of how the regimen builder works and each step
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
 * ENTRYFLATLIST.TSX -----------------------------------------------------------------------------------------------------------------------------
 * 
 * Issues: 
 * 
 * - In TextArea Keyboard on dismisal still clips the text, not a huge issue but something I'd like to fix if i can
 * 
 * RESOLVED - TextArea scroll to bottom on entry open does not work as it should, it shouldnt be focused on open anyways
 * RESOLVED - for some reason the entry status only updates if I move to another entry then go back to the previous entry that I tried updating,
 *   this means there is a entry length or existing problem that prevents a single entry from acquiring its correct status 
 *          - Issue was the useEffect didn't have the correct dependency required for rerender which was route.params
 * RESOLVED - render issues with the flatlist
 * RESOLVED - indexing error when using input field to go to specific index
 * 
 * 
 * 
 * 
 * CURRENTLY WORKING ON:
 * 
 * COMPLETED - adding last modified parameter and logic to item component
 *    actually most of the work will be done in TextArea.tsx
 * 
 * COMPLETED - add a textinput field to go to a specific day
 * COMPLETED - Adding a scroll to top and bottom button for flatlist
 * 
 * COMPLETED - Archiving
 *    RESOLVED - got it to work just need to figure out the styling of the button or how I want to implement it
 *     - issues
 *         RESOLVED - entry indexing is wrong at the moment gotta figure out what is causing that 
 *                   the correct storage key exists it is just updating wrong
 *          RESOLVED - since im no longer using the items component the animation/status useStates are used across all the items so they all get selected
 *                   this can probably be solved by triggering a regular function instead and checking the ref style and adjusting accordingly
 *
 *  
 * COMPLETED - implement archiving ****
 *    - Got the active function and app refresh storage logic for it perfected now just need to implement in Item.tsx
 * 
 * 
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
 * - In TextArea.tsx
 *    - After focused is lost on textinput display button to send update via SMS or Email via AWS services
 *       - either using SES SNS or some how Twilio for SMS or unless AWS has an SMS service (SNS and End User Messaging combo)
 *
 * - MAYBE integrate Grok for the Regimen Builder to help with info on exercises, recommandations, etc 
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
 * TextArea.tsx -------------------------------------------------------------------------------------------------------------------------------------------
 /**
* NOTE:
* - RESOVLED still might be some inconsistency with the scrolling not sure
* - RESOLVED (i think) also very bad bouncing when using the space bar alot
* 
* 
* FUTURE THINGS:
* Getting font size to work for each individual new line instead of all the text
*      - NOT POSSIBLE IN MULTILINE TEXTINPUT
*      - react-native-pell-rich-editor or react-native-rich-editor REQUIRED 
*          - this will also allow me to add other formatting tools
*          - would work with asyncstorage 
*               - Serialize the editor's content to a string (e.g., HTML or a JSON array like [{ char: 'a', size: 16 }, { char: 'b', size: 24 }]) on blur or "Done" press.
* 
* 
* 
* Issues:
* RESOLVED - Line height still cuts off on j g and similar characters
* RESOLVED - When focusing on the TextInput it dismisses the keyboard on first attempt for some reason
* RESOLVED - Done disappears when keyboard is not fully dismissed on swipe sometimes
* NOT NEEDED - Figure out how to save the data on keyboard dismissal
* RESOLVED - Keyboard gets stuck now when trying to dismiss it without an abrupt swipe
* RESOLVED - Keyboard doesn't smoothly transition out on scrolling up
* RESOLVED - Focus status gets set to true on refresh for some reason once data is saved
* NOT NEEDED - Still need to make it so the keyboard dismissal causes the data to be saved
* RESOLVED scrollview onScroll event is not consistently firing so i can't gauge its value and status 
* RESOLVED I THINK - InputAccessory not being fully attached to keyboard, when keyboard dimisses you see a litle margin/gap between them
* RESOLVED - Without height set on TextInput I can't scroll it while its focused, but I can scroll the scrollview without autofocusing
* RESOLVED - With height set on TextInput I can scroll it while its focused, but keyboard dismiss clips the text and scrolling while the TextInput is not focused
*   causes it to autofocus so I can't freely scroll the scrollview
* RESOLVED - On focus with nothing saved causes the scrollview to scroll to bottom for some reason causing the caret to go above the header
*              -just had to adjust the extrascrollheight on scrollview and the inputHeight buffer
* 
* 
*/