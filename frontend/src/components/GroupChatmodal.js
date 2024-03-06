import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Chatstate } from "../context/ChatProvider";
import UserlistItem from "../components/UserlistItem";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatmodal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [GroupChatName, SetGroupChatName] = useState("");
  const [selectedUser, SetselectedUser] = useState([]);
  const [Search, SetSearch] = useState("");
  const [Searchresult, SetSearchresult] = useState([]);
  const [Loading, SetLoading] = useState(false);

  const toast = useToast();

  const { user, Chats, SetChats } = Chatstate();

  const handleSearch = async (query) => {
    SetSearch(query);
    if (!query) {
      return;
    }
    try {
      SetLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`api/user?search=${Search}`, config);
      SetLoading(false);
      SetSearchresult(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleSubmit = async () => {
    if (!GroupChatName || !selectedUser) {
      toast({
        title: "Please fill all the feild",
        status: "warnig",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: GroupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );

      SetChats([data, ...Chats]);
      onClose();
      toast({
        title: "New Group Chat is created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to create Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDelete = (u) => {
    SetselectedUser(selectedUser.filter((user) => user._id !== u._id));
  };

  const handleGroup = (user) => {
    if (selectedUser.includes(user)) {
      toast({
        title: "User already added.",
        status: "warnig",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    SetselectedUser([...selectedUser, user]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">
            Create Group chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={GroupChatName}
                onChange={(e) => SetGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUser.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {Loading ? (
              <div>Loading...</div>
            ) : (
              Searchresult?.slice(0, 4).map((user) => (
                <UserlistItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatmodal;
