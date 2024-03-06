import React, { useState } from "react";
import { Chatstate } from "../context/ChatProvider";
import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import ChatsBox from "./ChatsBox";
import { Box } from "@chakra-ui/react";

export default function Chatpage() {
  const { user } = Chatstate();
  const [fetchAgain, SetfetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatsBox fetchAgain={fetchAgain} SetfetchAgain={SetfetchAgain} />
        )}
      </Box>
    </div>
  );
}
