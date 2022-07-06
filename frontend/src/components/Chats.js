import { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Flex } from '@chakra-ui/react';
import MainHeader from './chat page/MainHeader';
import UserChats from './chat page/UserChats';
import ChatBox from './chat page/ChatBox';

const Chats = () => {
  const { user } = ChatState();
  const [fetchChats, setFetchChats] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {user && <MainHeader />}
      <Flex h='100%' p={1}>
        {user && <UserChats fetchChats={fetchChats} />}
        {user && (
          <ChatBox fetchChats={fetchChats} setFetchChats={setFetchChats} />
        )}
      </Flex>
    </div>
  );
};

export default Chats;
