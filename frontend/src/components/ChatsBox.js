import React from "react";
import { Chatstate } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Singlechat from "./Singlechat";

export default function ChatsBox({ fetchAgain, SetfetchAgain }) {
  const { SelectedChat } = Chatstate();
  return (
    <Box
      display={{ base: SelectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Singlechat fetchAgain={fetchAgain} SetfetchAgain={SetfetchAgain} />
    </Box>
  );
}
