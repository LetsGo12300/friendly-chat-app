import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Spinner,
  useToast,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import UserModal from './miscellaneous/user components/UserModal';
import UpdateGroupChatModal from './miscellaneous/user chats/UpdateGroupChatModal';
import { getSenderName, getSender } from '../../config/ChatLogics';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;

const ChatBox = ({ fetchChats, setFetchChats }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const [loading, setLoading] = useState(false);
  const [loadingSendButton, setloadingSendButton] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Get all chats from selectedChat
  const getChats = async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: user.token,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setLoading(false);
      setMessages(data);
      socket.emit('join chat', selectedChat._id);
    } catch {
      toast({
        title: 'Failed to retrieve chats',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', JSON.parse(localStorage.getItem('userData'))._id);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
    socket.on('typing', () => {
      setIsTyping(true);
    });
    socket.on('stop typing', () => {
      setIsTyping(false);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // call getChats whenever the user selects a chat
    getChats();
    // clear message input field
    setMessage('');

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chatID._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    // If user stops typing after 2s, remove typing animation
    let lastTypingTime = new Date().getTime();
    let timerLength = 2000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // If user presses Enter, proceed to handle send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // For send button
  const handleSendMessage = async () => {
    socket.emit('stop typing', selectedChat._id);

    if (!message) {
      return;
    }

    try {
      setloadingSendButton(true);
      // Send post request
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: user.token,
        },
      };
      const { data } = await axios.post(
        '/api/message',
        {
          message: message,
          chatID: selectedChat._id,
          sender: user._id,
        },
        config
      );
      setloadingSendButton(false);
      socket.emit('new message', data);
      // Update messages
      setMessages([...messages, data]);
      // Reset input field
      setMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setloadingSendButton(false);
    }
  };

  const toast = useToast();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems='center'
      flexDirection='column'
      p={3}
      bg='white'
      w='100%'
      height='100%'
      borderTopWidth={3}
      borderBottomWidth={6}
      borderLeftWidth={{ base: selectedChat ? 6 : 3, md: 3 }}
      borderRightWidth={6}
      borderColor='gray.300'
    >
      {selectedChat ? (
        <Flex flexDirection='column' height='100%' w='100%'>
          {selectedChat.isGroupChat ? (
            <Flex
              justifyContent='space-between'
              alignItems='center'
              mb={2}
              gap={2}
            >
              <Button
                display={{ base: 'block', md: 'none' }}
                onClick={() => setSelectedChat('')}
              >
                <i className='fa-solid fa-arrow-left'></i>
              </Button>
              <Box>
                <Text textAlign='center' fontSize={{ base: '1em', md: '2xl' }}>
                  {selectedChat.chatName}
                </Text>
              </Box>
              <UpdateGroupChatModal
                fetchChats={fetchChats}
                setFetchChats={setFetchChats}
              >
                <Button>
                  <i className='fa-solid fa-circle-info'></i>
                </Button>
              </UpdateGroupChatModal>
            </Flex>
          ) : (
            <Flex
              justifyContent='space-between'
              alignItems='center'
              mb={2}
              gap={2}
            >
              <Button
                display={{ base: 'block', md: 'none' }}
                onClick={() => setSelectedChat('')}
              >
                <i className='fa-solid fa-arrow-left'></i>
              </Button>
              <Box>
                <Text textAlign='center' fontSize={{ base: '1em', md: '2xl' }}>
                  {getSenderName(user, selectedChat.members)}
                </Text>
              </Box>
              <UserModal user={getSender(user, selectedChat.members)}>
                <Button>
                  <i className='fa-solid fa-circle-info'></i>
                </Button>
              </UserModal>
            </Flex>
          )}

          <Flex
            className='overflow'
            flexDirection='column'
            bg='gray.100'
            h='100%'
            p={2}
          >
            {loading ? (
              <Flex
                h='100%'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
              >
                <Spinner
                  thickness='4px'
                  speed='0.5s'
                  emptyColor='gray.200'
                  color='pink.500'
                  size='lg'
                />
              </Flex>
            ) : (
              <Box p={2}>
                <ScrollableChat messages={messages} isTyping={isTyping} />
              </Box>
            )}
          </Flex>
          <Flex alignItems='center' pb={2} px={2} bg='gray.100'>
            <FormControl mr={1} isRequired>
              <Input
                bg='white'
                value={message}
                variant='outline'
                focusBorderColor='pink.500'
                placeholder='Enter message'
                size='md'
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
              />
            </FormControl>
            <Button
              h='90%'
              colorScheme='teal'
              variant='solid'
              size='sm'
              onClick={handleSendMessage}
              isLoading={loadingSendButton}
            >
              Send
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          h='100%'
          w='100%'
        >
          <Text fontSize='2xl' color='gray.500'>
            Click on a chat to start!
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default ChatBox;
