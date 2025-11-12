import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import "./App.css";
import NotificationListener from "./shared/socket/NotificationListener";
import ChatListener from "./shared/socket/ChatListener";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { useEffect } from "react";
import { connectSocket } from "./shared/socket/socket";

const App = () => { 
 const userId=useSelector((state:RootState)=>state.auth.userId)
   useEffect(() => {
    console.log("Im running",userId);
    
    if (userId) {
      connectSocket(userId); 
    }
  }, [userId]);

     return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
      <NotificationListener/>
      <ChatListener/>
        <AppRoutes /> 
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;