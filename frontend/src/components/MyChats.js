import React, { useEffect, useState } from "react";
import { Chatstate } from "../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import Chatloading from "./Chatloading";
import { getSender } from "../config/Chatlogics";
import GroupChatmodal from "./GroupChatmodal";

function MyChats({ fetchAgain }) {
  const [LoggedUser, SetLoggedUser] = useState("");
  const { user, SelectedChat, SetSelectedChat, Chats, SetChats } = Chatstate();

  const toast = useToast();

  const fetchchat = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get("/api/chat/", config);
      SetChats(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to load the Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    SetLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchat();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "25px", md: "20px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center">
        {" "}
        My Chats
        <GroupChatmodal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatmodal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY="hidden">
        {Chats ? (
          <Stack overflowY="scroll">
            {Chats.map((chat) => (
              <Box
                onClick={() => SetSelectedChat(chat)}
                cursor="pointer"
                bg={SelectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={SelectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}>
                <Text>
                  {!chat.isGroupChat
                    ? getSender(LoggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
