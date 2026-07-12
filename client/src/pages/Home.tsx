import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Celebrity Name Chain Home Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
          <IonButton
          expand="block" 
          routerLink="/games/CreateRoomCode"
          >
          Create Room Code 
          </IonButton>
          
          <IonButton
          expand="block" 
          routerLink="/games"
          >
          Current Room Codes
          </IonButton>
          <IonButton
          expand="block" 
          routerLink="/games"
          >
          Start Game
          </IonButton>
      </IonContent>
     
    </IonPage>
  );
};

export default Home;
