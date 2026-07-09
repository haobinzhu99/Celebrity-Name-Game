//@ts-nocheck
import React from "react";

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

import { heart } from 'ionicons/icons';
 
import { 
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';

import { 
    useForm, 
    Controller,
} from "react-hook-form";
 
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

//I have a .env.example file, does this mean I have to create a .env file in client folder that holds the same http://localhost:3000 value?
//extablishes the target address for your backend server. If you have a .env file with VITE_API_URL defined, it will use that value; otherwise, it defaults to 'http://localhost:3000'. 
// So it loos into the .env file for the VITE_API_URL variable. If it finds it, it uses that value; if not, it falls back to 'http://localhost:3000'. This is useful for configuring different environments (like development, staging, production) without changing the code.


interface CelebrityName {
    RoomCode: string;
    Username: string;
    CelebrityName: string;
};

// TS blueprint, for the data structure that will be used when submitting the form. It must have a RoomCode, a Username, and a CelebrityName,

const Answers = () => { 
    const queryClient = useQueryClient();

    const {control, handleSubmit, reset, getValues, watch} = useForm ({
        defaultValues: {
            RoomCode: '',
            Username: '',
            CelebrityName: '',
        }
    });
    
    const RoomCodeToCheck = watch("RoomCode");

    const {data : latestCelebrity } = useQuery({ 
        queryKey: ["latestCelebrity",RoomCodeToCheck],
        queryFn: () => 
            fetch(`${API_URL}/games/${RoomCodeToCheck}`).then((res) => res.json()),
        refetchInterval: 1500, 
    });

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
            }).then((res) => res.json()),
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["latestCelebrity", variable.RoomCode] });
                reset({
                    RoomCode: getValues("RoomCode"),             
                    Username: getValues("Username"), 
                    CelebrityName: '',
                });
                console.log("I am here: ", game);

            }
    });    


    
    const onSubmit = (data: CelebrityName) => {
    
        // alert();
        // setLocalAnswers((prevAnswers) => [...prevAnswers, data]); //FOR LOCAL TESTING PURPOSES USING GEMINI AI
        mutate(data);
    };


    return <>
        <IonPage> 
            <IonHeader>
                <IonToolbar>
                    <IonTitle color="tertiary">Celebrity Name Answer</IonTitle>
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
                <Controller 
                    name="RoomCode"
                    control={control}
                    render={({ field })  => (
                        <IonInput 
                        fill="outline"
                        label="Enter Room Code"
                        value={field.value}
                        onIonChange={(e) => field.onChange(e.detail.value)}
                        />
                    )}
                /> 
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
                <h2><strong>Current Celebrity: {typeof latestCelebrity === 'object' ? latestCelebrity?.latestCelebrity : latestCelebrity}</strong></h2>
                <p>Submitted by: {}</p>
            </IonLabel>
          </IonItem>
        </IonList> 
            </IonContent>
            </IonPage>
    </>
};

export default Answers;