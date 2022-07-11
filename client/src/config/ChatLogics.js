export const getSenderName = (loggedUser, members) => {
  return loggedUser._id === members[0]._id ? members[1].name : members[0].name;
};

export const getSender = (loggedUser, members) => {
  return loggedUser._id === members[0]._id ? members[1] : members[0];
};

export const ifUser = (loggedUser, message) => {
  if (loggedUser._id === message.sender._id) {
    return true;
  } else return false;
};

// check if last message is from the same sender
export const ifLastMessage = (messages, message, index) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id === message.sender._id
  );
};

// check if previous message is from the same sender
export const ifSameSender = (messages, message, index) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined)
  );
};
