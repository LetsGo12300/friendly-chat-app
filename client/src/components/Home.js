import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));

    if (user) {
      navigate('/chats');
    }
  }, [navigate]);

  useEffect(() => {
    document.title = 'Friendly Chat - Log In or Sign Up';
  }, []);

  return (
    <Container maxW='2xl' h='100%' centerContent>
      <Box
        bg='blue.800'
        color='white'
        p={4}
        w='100%'
        m='30px 0px 3px 0px'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text fontSize='2xl'>Friendly Chat</Text>
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
