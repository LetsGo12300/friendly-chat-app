import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import UserModal from './miscellaneous/main header/UserModal';
import UpdateGroupChatModal from './miscellaneous/user chats/UpdateGroupChatModal';
import { getSenderName, getSender } from '../../config/ChatsController';

const ChatBox = ({ fetchChats, setFetchChats }) => {
  const { user, selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems='center'
      flexDirection='column'
      p={3}
      bg='white'
      w='100%'
      borderRadius='lg'
      borderWidth={6}
      height='100%'
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

          <Flex bg='gray.100' height='100%' w='100%'>
            Chat box
          </Flex>
        </Flex>
      ) : (
        <Flex
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          height='100%'
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
