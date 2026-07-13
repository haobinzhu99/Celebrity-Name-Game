//@ts-nocheck
//disables strict ts compilation checks for this file
import React, { 
    useEffect,
    useState
 } from "react";
 //imports from the react library 
import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonList,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonIcon,
    IonPage,
} from "@ionic/react";
//imports ui from ionic framework 
import { heart } from 'ionicons/icons';
 //imports the heart icon from library above
import { 
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
//useQuery/Client for the get routes and mutation to change like post delete
import { 
    useForm, 
    Controller,
} from "react-hook-form"; 
//manage state validation and structural bindings and submission handling
import { 
    useParams 
} from 'react-router-dom'; 
//is a hook used to extract dynamic parameters from the current URL path 
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
// Sets up your base backend server link, fallback-defaulting back to localhost port 3000 if no environment variables exist.
interface CelebrityName {
    RoomCode: string;
    Username: string;
    CelebrityName: string;
};
// TS blueprint, for the data structure that will be used when submitting the form. It must have a RoomCode, a Username, and a CelebrityName,
const Answers = () => { 
    const queryClient = useQueryClient();
    // Connects to the main TanStack configuration network instance, providing accessibility to manually invalidate or clear server query pools.
    const { roomCode } = useParams<{ roomCode: string}>();
    // Connects to the main TanStack configuration network instance, providing accessibility to manually invalidate or clear server query pools.
    const [lastSubmitter, setLastSubmitter] = useState<string>("System Starter")
    // Allocates local reactive hook memory storage tracking who completed the last answer post locally within this specific viewing window.
    const {control, handleSubmit, reset, getValues, watch, setValue} = useForm<CelebrityName> ({
        defaultValues: {
            RoomCode: roomCode || '',
            Username: '',
            CelebrityName: '',
        }
    });
    // Destructures core utilities from react-hook-form, seeding standard initial conditions for fields like RoomCode, Username, and CelebrityName.
    useEffect(() => {
        if (roomCode) {
            setValue("RoomCode", roomCode );
        }
    }, [roomCode, setValue]);
    // Triggers an event hook whenever the route roomCode shifts, programmatically driving that updated parameter string straight back into form state.
    const RoomCodeToCheck = watch("RoomCode");
    // Subscribes a listener property to the "RoomCode" state entry inside react-hook-form, updating its value string every single keystroke.
    const {data: gameData, error: queryError } = useQuery({ 
        queryKey: ["latestCelebrity", roomCode],
        queryFn: () => 
            fetch(`${API_URL}/games/${roomCode}`).then((res) => res.json()),
        refetchInterval: 1500, 
        enabled: !!roomCode,
    });
    // Fires off an auto-polling network fetch targeting your backend game routes at 1.5-second cycles, provided a valid roomCode exists in context.
    console.log("TYPE OF GAMEDATA:", typeof gameData, "VALUE:", gameData);
    // Essential trace utility printing the backend payload profile directly back to your web inspector platform every rendering frame pass.
    const { mutate, isPending } = useMutation({
        mutationFn: (newAnswer: CelebrityName) => 
            fetch(`${API_URL}/answers`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    roomCode: newAnswer.RoomCode,
                    username: newAnswer.Username,
                    answer: newAnswer.CelebrityName
                }),
            }).then((res) => {
                if (!res.ok) throw new Error ("Failed to post submission");
                return res.json();
            }),
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["latestCelebrity", variables.RoomCode] });
                
                if (variables.Username) {
                   setLastSubmitter(variables.Username);
                }
                reset({
                    RoomCode: getValues("RoomCode"),             
                    Username: getValues("Username"), 
                    CelebrityName: '',
                });
                console.log("Answer registerd successfully: ", data);

            }
    });    


    
    const onSubmit = (data: CelebrityFormInput) => {
    
        // alert();
        // setLocalAnswers((prevAnswers) => [...prevAnswers, data]); //FOR LOCAL TESTING PURPOSES USING GEMINI AI
        mutate(data);
    };

    const displayCelebrityText = () => {
        
   
        if (queryError) return `Error: ${queryError.message}`;
        if (!gameData) return "Loading active celebrity...";

        if (typeof gameData === "string") {
        return gameData;
        }
   
        let target = Array.isArray(gameData) ? gameData[0] : gameData;
        if (target && target.data) {
            target = target.data;
        }
    
        if (!target) return "No data payload";
        

        return target.CelebrityName || 
               target.celebrityName || 
               target.celebrity || 
               ("Key Mismatch - Check Console");
    };

    return <>
        <IonPage> 
            <IonHeader>
                <IonToolbar>
                    <IonTitle color="tertiary"> Active Room: {roomCode} </IonTitle>
                    {/*<IonTitle color="tertiary">Celebrity Name Answer</IonTitle>*/}
                    <IonButton
                        slot='end'
                        shape='round'
                        type='button'
                        routerLink={'/games'}
                    >
                        All Room Codes Here
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/*}
                    <div style={{ display: 'none' }}>
                        <Controller 
                            name="RoomCode"
                            control={control}
                            render={({ field }) => (
                                <IonInput 
                                    type="hidden"
                                    value={field.value}
                                    onIonChange={(e) => field.onChange(e.detail.value)}
                                />
                            )}
                        /> 
                    </div> */}
                <IonItem>
                <Controller
                    name="Username"
                    control={control}
                    render={({ field }) => (
                        <IonInput
                        label="Username"
                        fill='outline'
                        value={field.value}
                        onIonChange={(e) => field.onChange(e.detail.value)}
                        />
                    )}
                /> 
                </IonItem>
                <IonItem>
                <Controller
                    name="CelebrityName"
                    control={control}
                    render={({ field }) => (
                        <IonInput
                        label="Celebrity Name"
                        fill='outline'
                        value={field.value}
                        onIonChange={(e) => field.onChange(e.detail.value)}
                        />
                 )}
                /> 
                </IonItem>
                <IonButton
                    shape='round'
                    fill='outline'
                    size='large'
                    type='submit'
                    color="tertiary"
                    >
                        Submit 
                        <IonIcon slot="end" icon={heart}> </IonIcon>
                </IonButton>
                <IonButton
                    routerLink="/"
                >
                    Press Here To Go Home
                </IonButton>
                
            </form>
                <IonToolbar>
                    Submitted Answers 
                </IonToolbar>
                <IonList>
                    <IonItem>
                        <IonLabel>
                        <h2><strong>Current Celebrity: {displayCelebrityText()}</strong></h2>
                        <p>Last Submitter (This Session): <strong>{lastSubmitter}</strong></p>
                        <p>Room Status: Active Sync</p>
                        </IonLabel>
                    </IonItem>
                </IonList> 
            </IonContent>
        </IonPage>
    </>
};

export default Answers;