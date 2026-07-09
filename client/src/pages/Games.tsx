//@ts-check
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
    IonPage,
} from "@ionic/react";

import { 
    useForm, 
    Controller,
} from "react-hook-form";

import { 
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface GameFormData {
    RoomCode: string;
    CelebrityName: string;

}

const Games = () => { 
    //useQueryClient function allows for 
    const queryClient = useQueryClient();
    const {control, handleSubmit, reset} = useForm ({
        defaultValues: {
            RoomCode: '',
        }
    });
    
    const {data : rooms } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => 
            fetch(`${API_URL}/games`).then((res) => res.json()),
        refetchInterval: 1500, 
    });
    

    const { mutate, isPending } = useMutation({
        mutationFn: (newRoom: GameFormData) => 
            fetch(`${API_URL}/games`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    roomCode: newRoom.RoomCode

                }),
            }).then((r) => r.json()),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["rooms"] });
                queryClient.invalidateQueries({ queryKey: ["latestcelebrity"]});
                reset({
                    RoomCode: '',
                });
            }
    }); 


    const onSubmit = (data: { RoomCode: string; Username: string }) => {
        console.log(data);
      //  setLocalAnswers((prevAnswers) => [...prevAnswers, data]); //FOR LOCAL TESTING PURPOSES USING GEMINI AI
        mutate(data);
    }; 
    

    return <>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Current Games and Create Game</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller 
                name="RoomCode"
                control={control}
                render={({ field })  => (
                    <IonInput 
                    fill="outline"
                    label="Create New Room Code"
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
            <IonButton
                shape='round'
                type='submit'
                >
                    Submit
            </IonButton>
            <IonButton
                shape='round'
                slot='end'
                routerLink={'/answers'}
                >
                Click Here To Play
            </IonButton>
            </form>
            {/*THIS WAS ADDED BY GEMINI AI TO TEST LOCAL ANSWERS.*/}
             <IonList>
                {rooms?.map((room: any) => (
                        <IonItem key={room.roomCode}>
                            <IonLabel>
                                <h2><strong>Room Code: {room.roomCode}</strong></h2>
                                <p>Latest Celebrity: {room.latestCelebrity ?? "None"}</p>
                            </IonLabel>
                        </IonItem>
                        ))}
                        {/*localAnswers.map((answer, index) => (
                        // Since we don't have a database auto-generating IDs, we use the array index as the key
                            <IonItem key={index}>
                                <IonLabel>
                                    <h2><strong>{answer.CelebrityName}</strong></h2>
                                    <p>Submitted by: {answer.Username} (Room: {answer.RoomCode})</p>
                                </IonLabel>
                            </IonItem>
                       ))}
                        {localAnswers.length === 0 && (
                        <p style={{ paddingLeft: '16px' }}>No answers submitted locally yet.</p>
                        )  */}
                    </IonList>
        </IonContent>
    </>
};

export default Games;