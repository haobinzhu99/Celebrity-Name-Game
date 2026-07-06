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
    useQuery 
    //useMutatuion,
    //useQueryClient
} from '@tanstack/react-query';

//const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const Games = () => { 
    const [localAnswers, setLocalAnswers] = React.useState([]);
    const {control, handleSubmit, reset} = useForm ({
        defaultValues: {
            RoomCode: '',
            Username: '',
        }
    });
    /*
    const {data : rooms, isLoading } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => fetch(`${API_URL}/`).then((r) => r.json()),
        refetchInterval: 1500, 
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (newRoom: { RoomCode: string; Username: string; }) => 
            fetch(`${API_URL}/games`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    roomcode: newRoom.RoomCode,
                    username: newRoom.Username,
                }),
            }).then((r) => r.json()),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["Rooms"] }),
    }); 
     */

    const onSubmit = (data: { RoomCode: string; Username: string }) => {
        console.log(data);
        setLocalAnswers((prevAnswers) => [...prevAnswers, data]); //FOR LOCAL TESTING PURPOSES USING GEMINI AI
        reset({
            RoomCode: data.RoomCode,
            Username: ''
        });
    }; 
    

    return <>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Games</IonTitle>
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
                    label="Enter New Room Code"
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
            </form>
            {/*THIS WAS ADDED BY GEMINI AI TO TEST LOCAL ANSWERS.*/}
             <IonList>
                        {localAnswers.map((answer, index) => (
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
                        )}
                    </IonList>
        </IonContent>
    </>
};

export default Games;