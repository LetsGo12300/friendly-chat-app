export const getSender = (loggedUser, members) => {
  return loggedUser._id === members[0]._id ? members[1].name : members[0].name;
};
