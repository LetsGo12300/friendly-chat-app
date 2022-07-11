import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Avatar,
  Flex,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import SearchLoading from './miscellaneous/user components/SearchLoading';
import UserModal from './miscellaneous/user components/UserModal';
import UserResult from './miscellaneous/user components/UserResult';
import axios from 'axios';

const MainHeader = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    chats,
    setChats,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  // Chakra UI toast
  const toast = useToast();

  // When logout button is clicked, proceed to login page
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  // For drawer
  const firstField = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //  API request to search for user to chat with
  const handleSearch = async () => {
    if (search) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: user.token,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        setSearchResult(data);
        setLoading(false);
      } catch {
        console.log('Failed to search');
      }
    }
  };

  // API request to start a chat with clicked/selected user
  const handleUserClick = async (clickedUser) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: user.token,
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/chat/',
        { userID: clickedUser._id },
        config
      );

      // if there is no existing chat yet, append to the chats state
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch {
      toast({
        title: 'Failed to create the chat',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      bg='white'
      w='100%'
      h='100%'
      px={3}
      py={2}
      borderTopWidth={6}
      borderBottomWidth={3}
      borderLeftWidth={6}
      borderRightWidth={6}
      borderColor='gray.300'
    >
      <Tooltip
        label='Click here to search a user to chat with'
        aria-label='A tooltip'
        bg='gray.300'
        color='black'
        placement='bottom-end'
        p={3}
        hasArrow
      >
        <Button
          onClick={onOpen}
          colorScheme='teal'
          size={{ base: 'sm', md: 'md' }}
        >
          <i className='fa-solid fa-magnifying-glass'></i>
          <Text display={{ base: 'none', md: 'flex' }} px='6'>
            Search
          </Text>
        </Button>
      </Tooltip>

      <Text
        className='other-font'
        fontSize={{ base: '1.2em', md: '3xl' }}
        color='gray.700'
      >
        FRIENDLY CHAT
      </Text>

      <Box>
        <Menu>
          <MenuButton mr={3}>
            {notifications.length ? (
              <span style={{ color: '#ED64A6' }}>
                <i
                  className='fa-solid fa-bell fa-lg fa-beat'
                  style={{ '--fa-animation-duration': '1.5s' }}
                ></i>
              </span>
            ) : (
              <span>
                <i className='fa-solid fa-bell fa-lg'></i>
              </span>
            )}
          </MenuButton>
          <MenuList w={'120px'}>
            <MenuGroup title={`Notifications (${notifications.length})`}>
              {notifications.length ? (
                notifications.map((notification) => {
                  return (
                    <MenuItem
                      key={notification._id}
                      onClick={() => {
                        setSelectedChat(notification.chatID);
                        setNotifications(
                          notifications.filter((n) => n !== notification)
                        );
                      }}
                    >
                      {notification.chatID.isGroupChat ? (
                        <Text>
                          New message in {notification.chatID.chatName}
                        </Text>
                      ) : (
                        <Text>New message from {notification.sender.name}</Text>
                      )}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem>No new notifications</MenuItem>
              )}
            </MenuGroup>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            padding={{ base: '0 1em', md: '0 1.5em' }}
            size={{ base: 'sm', md: 'md' }}
          >
            <Flex alignItems='center'>
              <Avatar
                size={{ base: 'xs', md: 'sm' }}
                name={user.name}
                src={user.displayPhoto}
              />
              <i
                style={{ marginLeft: '15px' }}
                className='fa-solid fa-caret-down fa-lg'
              ></i>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuGroup title={user.name}>
              <UserModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </UserModal>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        initialFocusRef={firstField}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Start a Friendly Chat</DrawerHeader>

          <DrawerBody>
            <Flex alignItems='center' gap={1} mb={5}>
              <Input
                focusBorderColor='pink.300'
                size='sm'
                ref={firstField}
                placeholder='Enter name or username'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>

              <Button
                onClick={handleSearch}
                px={5}
                size='sm'
                colorScheme='teal'
                isLoading={loading}
              >
                Search
              </Button>
            </Flex>

            {loading ? (
              <SearchLoading />
            ) : (
              searchResult.map((searchedUser) => {
                return (
                  <UserResult
                    key={searchedUser._id}
                    handleUserClick={handleUserClick}
                    user={searchedUser}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml='auto' d='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default MainHeader;
