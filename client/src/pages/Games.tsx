//@ts-check
import { useState } from "react";

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
    useIonRouter
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
    const router = useIonRouter();

    const {control, handleSubmit, reset} = useForm ({
        defaultValues: {
            RoomCode: '',
            CelebrityName: ''
        }
    });
    const {data : rooms, isLoading, isError } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => 
            fetch(`${API_URL}/games`).then((res) => res.json()),
        refetchInterval: 1500, 
    });
    

    const { mutate, isPending } = useMutation({
        mutationFn: (newRoom: GameFormData ) => 
            fetch(`${API_URL}/games`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    roomCode: newRoom.RoomCode,
                    celebrity: newRoom.CelebrityName
                }),
            }).then((r) => r.json()),
        onSuccess: (data, variable) => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            queryClient.invalidateQueries({ queryKey: ["latestcelebrity"]});
            reset({
                RoomCode: '',
                CelebrityName: ''
            });

            router.push(`/answers/${variable.RoomCode}`);
        }
    }); 


    const onSubmit = (data: { RoomCode: string; CelebrityName: string }) => {
        console.log(data);
        mutate(data);
    }; 
    

    return <>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Start Game</IonTitle>
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
                    label="Enter Room Code"
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
            <div style={{ display: 'flex', gap: '10px' }}>
                        {/* This submits the form, updates DB, and navigates to /answers/roomcode on success */}
                        <IonButton
                            shape='round'
                            type='submit'
                            disabled={isPending}
                        >
                            {isPending ? 'Starting...' : 'Submit & Start'}
                        </IonButton>
                    </div>
                </form>

                 <IonList className="ion-margin-top">
                    {rooms?.map((room: any) => (
                        <IonItem 
                            key={room.roomCode} 
                            button 
                            detail={true}
                            onClick={() => router.push(`/answers/${room.roomCode}`)}
                        >
                            {/* 4. Added an onClick here so players can click any existing room from the list to join it directly */}
                            <IonLabel>
                                <h2><strong>Room Code: {room.roomCode}</strong></h2>
                                <p>Latest Celebrity: {room.latestCelebrity ?? "None"}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
             {/*<IonList>
                {rooms?.map((room: any) => (
                        <IonItem key={room.roomCode}>
                            <IonLabel>
                                <h2><strong>Room Code: {room.roomCode}</strong></h2>
                                <p>Latest Celebrity: {room.latestCelebrity ?? "None"}</p>
                            </IonLabel>
                        </IonItem>
                        ))}
                    
                    </IonList> */}
        </IonContent>
        </IonPage>
    </>
};

export default Games;