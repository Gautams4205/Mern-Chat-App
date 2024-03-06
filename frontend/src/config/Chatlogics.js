export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (Messages, m, i, userId) => {
  return (
    i < Messages.length - 1 &&
    (Messages[i + 1].sender._id !== m.sender._id ||
      Messages[i + 1].sender._id === undefined) &&
    Messages[i].sender._id !== userId
  );
};

export const isLastMessage = (Messages, i, userId) => {
  return (
    i === Messages.length - 1 &&
    Messages[Messages.length - 1].sender._id !== userId &&
    Messages[Messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (Messages, m, i, userId) => {
  if (
    i < Messages.length - 1 &&
    Messages[i + 1].sender._id === m.sender._id &&
    Messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < Messages.length - 1 &&
      Messages[i + 1].sender._id !== m.sender._id &&
      Messages[i].sender._id !== userId) ||
    (i === Messages.length - 1 && Messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (Messages, m, i) => {
  return i > 0 && Messages[i - 1].sender._id === m.sender._id;
};
