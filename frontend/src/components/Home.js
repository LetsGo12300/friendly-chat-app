import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import Login from './authentication/Login';
import Signup from './authentication/Signup';

const Home = () => {
  useEffect(() => {
    document.title = 'Log In';
  });

  return (
    <Container maxW='2xl' centerContent>
      <Box
        bg='blue.800'
        color='white'
        p={4}
        w='100%'
        m='30px 0px 3px 0px'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text className='home-title' fontSize='2xl'>
          Friendly Chat
        </Text>
      </Box>
      <Box
        bg='blue.800'
        color='white'
        d='flex'
        justifyContent='center'
        p={2}
        w='100%'
        m='3px 0px'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Tabs isFitted colorScheme='pink'>
          <TabList mb='0.5em'>
            <Tab>Log In</Tab>
            <Tab>Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
