import { ChatState } from '../context/ChatProvider';
import { Flex, Spacer } from '@chakra-ui/react';
import MainHeader from './chat page/MainHeader';
import UserChats from './chat page/UserChats';
import ChatBox from './chat page/ChatBox';

const Chats = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: '100%' }}>
      {user && <MainHeader />}
      <Flex p='1rem'>
        {user && <UserChats />}
        <Spacer />
        {user && <ChatBox />}
      </Flex>
    </div>
  );
};

export default Chats;
