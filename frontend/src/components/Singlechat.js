import React, { useEffect, useState } from "react";
import { Chatstate } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/Chatlogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";

const ENDPOINT = "http://localhost:8000";
let socket, SelectedChatCompare;

const Singlechat = ({ fetchAgain, SetfetchAgain }) => {
  const [Messages, SetMessages] = useState([]);
  const [newMessages, SetnewMessages] = useState("");
  const [Loading, SetLoading] = useState(false);
  const [SocketConnected, SetSocketConnected] = useState(false);
  const [Typing, SetTyping] = useState(false);
  const [isTyping, SetisTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const { user, SelectedChat, SetSelectedChat, Notification, SetNotification } =
    Chatstate();

  const toast = useToast();

  const fetchMessages = async () => {
    if (!SelectedChat) {
      return;
    }
    try {
      SetLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${SelectedChat._id}`,
        config
      );
      SetMessages(data);
      SetLoading(false);
      socket.emit("join chat", SelectedChat._id);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to Load the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      SetLoading(false);
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => SetSocketConnected(true));
    socket.on("typing", () => SetisTyping(true));
    socket.on("stop typing", () => SetisTyping(false));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchMessages();
    SelectedChatCompare = SelectedChat;
    // eslint-disable-next-line
  }, [SelectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessagesRecieved) => {
      if (
        !SelectedChatCompare ||
        SelectedChatCompare._id !== newMessagesRecieved.chat._id
      ) {
        if (!Notification.includes(newMessagesRecieved)) {
          SetNotification([newMessagesRecieved, ...Notification]);
          SetfetchAgain(!fetchAgain);
        }
      } else {
        SetMessages([...Messages, newMessagesRecieved]);
      }
    });
  });

  const sendmessage = async (e) => {
    if (e.key === "Enter" && newMessages) {
      socket.emit("stop typing", SelectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        SetnewMessages("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessages,
            chatId: SelectedChat._id,
          },
          config
        );
        socket.emit("new message", data);

        SetMessages([...Messages, data]);
      } catch (error) {
        toast({
          title: "Error occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    SetnewMessages(e.target.value);
    if (!SocketConnected) return;
    if (!Typing) {
      SetTyping(true);
      socket.emit("typing", SelectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= 4000 && Typing) {
        socket.emit("stop typing", SelectedChat._id);
        SetTyping(false);
      }
    }, 4000);
  };
  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
            {" "}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => SetSelectedChat("")}
            />
            {!SelectedChat.isGroupChat ? (
              <>
                {getSender(user, SelectedChat.users)}
                <ProfileModal user={getSenderFull(user, SelectedChat.users)} />
              </>
            ) : (
              <>
                {SelectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  SetfetchAgain={SetfetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
            {Loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat Messages={Messages} />
              </div>
            )}
            <FormControl onKeyDown={sendmessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom:15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message... "
                onChange={typingHandler}
                value={newMessages}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%">
          <Text fontSize="3xl" fontFamily="Work sans">
            Click on a user to start a chatting.
          </Text>
        </Box>
      )}
    </>
  );
};

export default Singlechat;
