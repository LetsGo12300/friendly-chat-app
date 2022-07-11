import React, { useEffect, useState } from 'react';
import {
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  FormControl,
  Input,
  Flex,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { ChatState } from '../../../../context/ChatProvider';
import UserBadge from '../user components/UserBadge';
import UserResult from '../user components/UserResult';
import axios from 'axios';

const UpdateGroupChatModal = ({ children, fetchChats, setFetchChats }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [showEditName, setShowEditName] = useState(false);

  // Reset states when the modal closes/opens
  useEffect(() => {
    setShowEditName(false);
    setGroupChatName(selectedChat.chatName);
    setSearch('');
    setSearchedUsers([]);
    // eslint-disable-next-line
  }, [isOpen]);

  const toggleEditGroupName = () => {
    setShowEditName(!showEditName);
  };

  const handleRenameGroupChat = async () => {
    if (!groupChatName) {
      toast({
        title: 'Please enter a group chat name!',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      return;
    }
    try {
      setLoadingButton(true);
      const config = {
        headers: {
          Authorization: user.token,
        },
      };
      const { data } = await axios.put(
        '/api/chat/rename',
        { chatID: selectedChat._id, chatName: groupChatName },
        config
      );
      setLoadingButton(false);
      setSelectedChat(data);
      setFetchChats(!fetchChats);
      toggleEditGroupName();
      onClose();
    } catch {
      toast({
        title: 'Error renaming the group chat',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoadingButton(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchedUsers([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchedUsers(data);
    } catch {
      toast({
        title: 'Failed to search users',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  const handleRemoveUserClick = async (removedUser) => {
    try {
      const config = {
        headers: {
          Authorization: user.token,
        },
      };
      const { data } = await axios.put(
        '/api/chat/removeuser',
        { chatID: selectedChat._id, userID: removedUser._id },
        config
      );

      removedUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchChats(!fetchChats);
    } catch (error) {
      toast({
        title: 'Failed to remove the user',
        description: error.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoadingButton(false);
    }
  };

  // If user is clicked (added to the group), include in the selectedUsers array
  const handleAddUserClick = async (addedUser) => {
    // check if user is already a member of the group

    if (selectedChat.members.find((member) => member._id === addedUser._id)) {
      toast({
        title: 'User is already a member',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      return;
    }

    setLoadingAdd(true);
    try {
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const { data } = await axios.put(
        '/api/chat/adduser',
        { chatID: selectedChat._id, userID: addedUser._id },
        config
      );
      setSelectedChat(data);
      setFetchChats(!fetchChats);
      setLoadingAdd(false);
    } catch (error) {
      toast({
        title: 'Failed to add the user',
        description: error.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoadingAdd(false);
    }
  };

  return (
    user && (
      <>
        <span onClick={onOpen}>{children}</span>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {showEditName ? (
                <Flex width='92%'>
                  <FormControl isRequired mb={2}>
                    <Input
                      value={groupChatName}
                      focusBorderColor='pink.500'
                      placeholder='Enter group chat name'
                      size='md'
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    ml={1}
                    colorScheme='gray'
                    onClick={toggleEditGroupName}
                  >
                    Cancel
                  </Button>
                  <Button
                    ml={1}
                    colorScheme='green'
                    onClick={handleRenameGroupChat}
                    isLoading={loadingButton}
                  >
                    Save
                  </Button>
                </Flex>
              ) : (
                <Flex width='92%' alignItems='center' justifyContent='start'>
                  <Text fontSize='xl'>{selectedChat.chatName}</Text>
                  <Button
                    ml={1}
                    variant='ghost'
                    color='pink.500'
                    onClick={toggleEditGroupName}
                  >
                    <i className='fa-solid fa-pen-to-square'></i>
                  </Button>
                </Flex>
              )}
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Flex mb={2} justifyContent='center' flexWrap='wrap'>
                {selectedChat.members
                  .filter((member) => member._id !== user._id)
                  .map((member) => {
                    return (
                      <UserBadge
                        key={member._id}
                        user={member}
                        handleUserClick={handleRemoveUserClick}
                      />
                    );
                  })}
              </Flex>

              <Box mb={2}>
                <FormControl isRequired>
                  <Input
                    value={search}
                    focusBorderColor='pink.500'
                    placeholder='Add members e.g., John, Jacob, Marie'
                    size='md'
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
              </Box>

              {loading || loadingAdd ? (
                <Flex justifyContent='center' mt={3}>
                  <Spinner color='teal' />
                </Flex>
              ) : (
                searchedUsers?.slice(0, 4).map((searchedUser) => {
                  return (
                    <UserResult
                      key={searchedUser._id}
                      user={searchedUser}
                      handleUserClick={handleAddUserClick}
                    />
                  );
                })
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                size='sm'
                colorScheme='red'
                onClick={() => handleRemoveUserClick(user)}
              >
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default UpdateGroupChatModal;
