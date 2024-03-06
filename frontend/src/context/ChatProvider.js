import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Chatcontext = createContext();

const ChatProvider = ({ children }) => {
  const [user, Setuser] = useState();
  const [SelectedChat, SetSelectedChat] = useState();
  const [Chats, SetChats] = useState([]);
  const [Notification, SetNotification] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    Setuser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Chatcontext.Provider
      value={{
        user,
        Setuser,
        SelectedChat,
        SetSelectedChat,
        Chats,
        SetChats,
        Notification,
        SetNotification,
      }}>
      {children}
    </Chatcontext.Provider>
  );
};

export const Chatstate = () => {
  return useContext(Chatcontext);
};

export default ChatProvider;
