/**
 * SCREENS IN REGIMENBUILDERSTACK FOLDER -----------------------------------------------------------------------------------------------------------------------
 * 
 * CURRENTLY WORKING ON:
 * 
 * 
 * COMPLETED - Establishing the screen navigation order and functionality
 * COMPLETED PARTIALLY - Building out the RegimenContext/Provider
 *    COMPLETED - I need to make it so the provider knows which route it is on and then adjust the visual step indicator per route 
 *     NEED TO COMPLETE- also need to build the visual step indicator as a component and import it into the RegimenProvider context
 * 
 * COMPLETED - Routing to and from for all the screens in the Regimen Builder 
 *             -learned how to pass parameters via route using form interface from types.tsx
 * 
 * 
 * 
 * TO DO AFTER EATING/Short nap:
 * COMPLETED (prototype) - Build visual step indicator as a component and import it into RegimenProvider (RegimenContext.tsx)
 * - Need to change the Alert titles and values on each screen, just has example one for now
 *      - commit after this before starting the build process
 * - Start building the Regimen Builder
 * COMPLETED - Add content to RegimenStartScreen.tsx either directly or via component
 *    - this content will consist of a welcome intro and guide/breakdown of how the regimen builder works and each step
 * -commit once RegimenStartScreen is set up because after that thats when the real work and modifications begin
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
 * - In TextArea Keyboard on dismisal still clips the text, not a huge issue but something I'd like to fix if i can
 * 
 * RESOLVED - TextArea scroll to bottom on entry open does not work as it should, it shouldnt be focused on open anyways
 * RESOLVED - for some reason the entry status only updates if I move to another entry then go back to the previous entry that I tried updating,
 *   this means there is a entry length or existing problem that prevents a single entry from acquiring its correct status 
 *          - Issue was the useEffect didn't have the correct dependency required for rerender which was route.params
 *
 * When coming back from eating
 * - commit everything
 * - merge
 * - apply for jobs for an hour
 * - start developing Regimens tab
 * 
 * 
 * 
 * CURRENTLY WORKING ON:
 * 
 * - adding last modified parameter and logic to item component
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