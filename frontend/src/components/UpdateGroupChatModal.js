import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Chatstate } from "../context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserlistItem from "./UserlistItem";

const UpdateGroupChatModal = ({ fetchAgain, SetfetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, SelectedChat, SetSelectedChat } = Chatstate();

  const [GroupChatName, SetGroupChatName] = useState("");
  const [Search, SetSearch] = useState("");
  const [Searchresult, SetSearchresult] = useState([]);
  const [Loading, SetLoading] = useState(false);
  const [RenameLoading, SetRenameLoading] = useState(false);

  const toast = useToast();

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
        position: "bottom",
      });
    }
  };

  const handleRemove = async (user1) => {
    if (SelectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only Admin can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      SetLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/groupremove",
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? SetSelectedChat() : SetSelectedChat(data);
      SetfetchAgain(!fetchAgain);
      fetchMessages();
      SetLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      SetLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Alredy in Group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (SelectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      SetLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/groupadd",
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      SetSelectedChat(data);
      SetfetchAgain(!fetchAgain);
      SetLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      SetLoading(false);
    }
  };

  const handleRename = async () => {
    if (!GroupChatName) return;
    try {
      SetRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: SelectedChat._id,
          chatName: GroupChatName,
        },
        config
      );

      SetSelectedChat(data);
      SetfetchAgain(!fetchAgain);
      SetRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      SetRenameLoading(false);
    }
    SetGroupChatName("");
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            cursor="pointer">
            {SelectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              w="100%"
              flexWrap="wrap"
              pb={2}
              cursor="pointer">
              {SelectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={GroupChatName}
                onChange={(e) => SetGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={RenameLoading}
                onClick={handleRename}>
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {Loading ? (
              <Spinner size="lg" />
            ) : (
              Searchresult?.slice(0, 4).map((user) => (
                <UserlistItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
