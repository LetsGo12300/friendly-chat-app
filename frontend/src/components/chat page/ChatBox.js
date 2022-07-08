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

const ChatBox = ({ fetchChats, setFetchChats }) => {
  const { user, selectedChat } = ChatState();

  const [loading, setLoading] = useState(false);
  const [loadingSendButton, setloadingSendButton] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // call getChats whenever the user selects a chat
  useEffect(() => {
    getChats();
    // eslint-disable-next-line
  }, [selectedChat]);

  // Get all chats from selectedChat
  const getChats = async () => {
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

  // If user presses Enter, proceed to handle send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // For send button
  const handleSendMessage = async () => {
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
            <Flex justifyContent='space-between' alignItems='center' mb={2}>
              <Button display={{ base: 'block', md: 'none' }}>
                <i className='fa-solid fa-arrow-left'></i>
              </Button>
              <Box>
                <Text fontSize={{ base: '1em', md: '2xl' }}>
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
            <Flex justifyContent='space-between' alignItems='center' mb={2}>
              <Button display={{ base: 'block', md: 'none' }}>
                <i className='fa-solid fa-arrow-left'></i>
              </Button>
              <Box>
                <Text fontSize={{ base: '1em', md: '2xl' }}>
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
                <ScrollableChat messages={messages} />
              </Box>
            )}
          </Flex>
          <Flex alignItems='center' p={2} bg='gray.100'>
            <FormControl mr={1} isRequired>
              <Input
                bg='white'
                value={message}
                variant='outline'
                focusBorderColor='pink.500'
                placeholder='Enter message'
                size='md'
                onChange={(e) => setMessage(e.target.value)}
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
