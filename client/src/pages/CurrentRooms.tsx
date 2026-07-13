import react from "react";

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
    useQuery
} from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const CurrentRooms = () => {
    const router = useIonRouter();

    const {data : Currentrooms, isLoading, isError } = useQuery({
        queryKey: ["Currentrooms"],
        queryFn: () => 
            fetch(`${API_URL}/games`).then((res) => res.json()),
            refetchInterval: 1500, 
    });
     
    
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
                <IonList className="ion-margin-top">
                    {Currentrooms?.map((room: any) => {
                        // Backend data normalization layer (handles lowercase or uppercase JSON keys securely)
                        const targetRoomCode = room.roomCode ?? room.RoomCode;
                        const targetCelebrity = room.latestCelebrity ?? room.CelebrityName ?? "None Chosen Yet";

                        return (
                            <IonItem 
                                key={targetRoomCode} 
                                button 
                                detail={true}
                                onClick={() => router.push(`/answers/${targetRoomCode}`)}
                            >
                                <IonLabel>
                                    <h2><strong>Room Code: {targetRoomCode}</strong></h2>
                                    <p>Latest Celebrity: {targetCelebrity}</p>
                                </IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>
        </IonContent> 
    </IonPage>
    </>
};

export default CurrentRooms;