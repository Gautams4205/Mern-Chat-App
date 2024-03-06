import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/Chatlogics";
import { Chatstate } from "../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ Messages }) => {
  const { user } = Chatstate();
  return (
    <ScrollableFeed>
      {Messages &&
        Messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(Messages, m, i, user._id) ||
              isLastMessage(Messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic 
                  //   ===
                  // "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  //   ? null
                  //   : m.sender.pic
                  }
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(Messages, m, i, user._id),
                marginTop: isSameUser(Messages, m, i, user._id) ? 3 : 10,
              }}>
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
