import React, { useState, useEffect } from 'react';
import { useToast, Box, Button, Stack, Text, Flex } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import SearchLoading from './miscellaneous/user components/SearchLoading';
import { getSenderName } from '../../config/ChatLogics';
import GroupChatModal from './miscellaneous/user chats/GroupChatModal';
import axios from 'axios';

const UserChats = ({ fetchChats }) => {
  const [loggedUser, setLoggedUser] = useState([]);
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  // For chakra UI toast
  const toast = useToast();

  // Fetch all chats of current user
  const getChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: user.token,
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
  }, [fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection='column'
      p={3}
      bg='white'
      height='100%'
      overflow='auto'
      borderTopWidth={3}
      borderBottomWidth={6}
      borderLeftWidth={6}
      borderRightWidth={{ base: selectedChat ? 6 : 3, md: 3 }}
      borderColor='gray.300'
    >
      <Flex
        alignItems='center'
        justifyContent='space-between'
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        w='100%'
      >
        <Text fontSize={{ base: '1.2rem', md: '1.5rem' }}>My Chats</Text>
        <GroupChatModal user={user}>
          <Button
            d='flex'
            size='sm'
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
          >
            <i
              style={{ marginRight: '8px' }}
              className='fa-solid fa-circle-plus'
            ></i>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>

      <Box w='100%'>
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  _hover={{
                    background: 'gray.300',
                  }}
                  px={3}
                  py={2}
                  borderRadius='lg'
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSenderName(loggedUser, chat.members)
                      : chat.chatName}
                  </Text>

                  {chat.lastMessage ? (
                    <Text fontSize='sm' color='teal.600'>
                      <b>{chat.lastMessage.sender.name}: </b>
                      {chat.lastMessage.message.length > 30
                        ? chat.lastMessage.message.slice(0, 30) + '...'
                        : chat.lastMessage.message}
                    </Text>
                  ) : (
                    ''
                  )}

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
