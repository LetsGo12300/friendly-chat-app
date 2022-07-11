import React, { useState } from 'react';
import { ChatState } from '../../../../context/ChatProvider';
import UserResult from '../user components/UserResult';
import UserBadge from '../user components/UserBadge';
import {
  useToast,
  useDisclosure,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const { user, chats, setChats, setSelectedChat } = ChatState();

  // for chakra UI toast
  const toast = useToast();

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

  // If user is clicked (added to the group), include in the selectedUsers array
  const handleAddUserClick = (clickedUser) => {
    const currentSelection = [...selectedUsers];
    // Ignore if user is already in the group
    if (!currentSelection.includes(clickedUser)) {
      currentSelection.push(clickedUser);
      setSelectedUsers(currentSelection);
    }
  };

  // If user is removed (X button is clicked) , remove in the selectedUsers array
  const handleRemoveUserClick = (removedUser) => {
    const updatedSelection = selectedUsers.filter(
      (user) => user._id !== removedUser._id
    );
    setSelectedUsers(updatedSelection);
  };

  // If the user clicks create button in the modal
  const handleCreate = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toast({
        title: 'Failed to create a group chat',
        description:
          'Tip: Group chat name is required. A group chat must contain 3 or more members.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      return;
    }

    try {
      setLoadingButton(true);
      const members = JSON.stringify(selectedUsers.map((user) => user._id));
      const body = {
        members: members,
        chatName: groupChatName,
      };
      const config = {
        headers: {
          Authorization: user.token,
        },
      };
      const { data } = await axios.post('/api/chat/creategroup', body, config);
      setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingButton(false);
      onClose();
    } catch {
      toast({
        title: 'Error creating the group chat',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoadingButton(false);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='title'>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={2}>
              <Input
                value={groupChatName}
                focusBorderColor='pink.500'
                placeholder='Enter group chat name'
                size='md'
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <Input
                value={search}
                focusBorderColor='pink.500'
                placeholder='Add members e.g., John, Jacob, Marie'
                size='md'
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Flex my={2} justifyContent='center' flexWrap='wrap'>
              {selectedUsers.map((selectedUser) => {
                return (
                  <UserBadge
                    key={selectedUser._id}
                    user={selectedUser}
                    handleUserClick={handleRemoveUserClick}
                  />
                );
              })}
            </Flex>

            {loading ? (
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
              colorScheme='teal'
              onClick={handleCreate}
              isLoading={loadingButton}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
