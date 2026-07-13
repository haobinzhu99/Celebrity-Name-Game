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
} from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const CreateRoomCode = () => {
    const router = useIonRouter();

    const {data : roomData, isLoading, isError } = useQuery({
        queryKey: ["RoomCode"],
        queryFn: () => 
            fetch(`${API_URL}/games/CreateRoomCode`).then((res) => {
                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }
                return res.json();
            }),
    });

    const generatedCode = roomData 
        ? (typeof roomData === "string" ? roomData : (roomData.roomCode ?? roomData.RoomCode))
        : "";
    
    return <>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Active Games</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent> 
                <IonButton
                    routerLink="/"
                >
                    Press Here To Go Home
                </IonButton>

                <IonButton
                    routerLink="/games"
                >
                    Start Game
                </IonButton>

                <IonList >
                    <p>Copy this code then Press Start Game then paste into Room Code </p>
                        <IonItem >
                            <IonLabel>
                                <strong>{generatedCode}</strong>
                            </IonLabel>
                        </IonItem>
                </IonList>
        </IonContent> 
    </IonPage>
    </>
};

export default CreateRoomCode;