import { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Grid, GridItem } from '@chakra-ui/react';
import MainHeader from './chat page/MainHeader';
import UserChats from './chat page/UserChats';
import ChatBox from './chat page/ChatBox';

const Chats = () => {
  const { user, selectedChat } = ChatState();
  const [fetchChats, setFetchChats] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Grid
        templateAreas={{
          base: selectedChat
            ? `"MainHeader MainHeader"
          "ChatBox ChatBox"`
            : `"MainHeader MainHeader"
          "UserChats UserChats"`,
          md: `"MainHeader MainHeader"
            "UserChats ChatBox"
            "UserChats ChatBox"`,
        }}
        gridTemplateRows={'65px minmax(0, 1fr)'}
        gridTemplateColumns={'33% 1fr'}
        h='100vh'
      >
        <GridItem area={'MainHeader'}>{user && <MainHeader />}</GridItem>
        <GridItem area={'UserChats'}>
          {user && <UserChats fetchChats={fetchChats} />}
        </GridItem>
        <GridItem area={'ChatBox'}>
          <ChatBox fetchChats={fetchChats} setFetchChats={setFetchChats} />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Chats;
