import React, { useState, useEffect } from 'react';
import { useToast, Box, Button, Stack, Text, Flex } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import SearchLoading from './miscellaneous/SearchLoading';
import { getSender } from '../../config/ChatsController';
import axios from 'axios';

const UserChats = () => {
  const [loggedUser, setLoggedUser] = useState([]);
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  // For chakra UI toast
  const toast = useToast();

  // Fetch all chats of current user
  const getChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch {
      toast({
        title: 'Failed to get all chats',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userData')));
    getChats();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection='column'
      justifyContent='space-between'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
      height='100%'
    >
      <Flex
        alignItems='center'
        justifyContent='space-between'
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        w='100%'
      >
        <Text>My Chats</Text>
        <Button d='flex' fontSize={{ base: '17px', md: '10px', lg: '17px' }}>
          <i
            style={{ marginRight: '8px' }}
            className='fa-solid fa-circle-plus'
          ></i>
          New Group Chat
        </Button>
      </Flex>

      <Box>
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius='lg'
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.members)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize='xs'>
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + '...'
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <SearchLoading />
        )}
      </Box>
    </Box>
  );
};

export default UserChats;
