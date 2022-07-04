import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const Login = () => {
  // For user input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // For button loading animation
  const [loading, setLoading] = useState(false);

  // Chakra UI toast
  const toast = useToast();

  // For showing password
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // For submit button
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = {
        username,
        password,
      };
      const config = { headers: { 'Content-type': 'application/json' } };
      const { data } = await axios.post('/login', user, config);
      // Store user information
      localStorage.setItem('userData', JSON.stringify(data));
      toast({
        title: 'User logged in successfully!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoading(false);
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={3}>
      <FormControl isRequired>
        <FormLabel htmlFor='username'>Username</FormLabel>
        <Input
          value={username}
          focusBorderColor='pink.500'
          id='username'
          placeholder='Enter your username'
          size='md'
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            value={password}
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            id='password'
            placeholder='Enter your password'
            size='md'
            focusBorderColor='pink.500'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button
              colorScheme='whiteAlpha'
              h='1.75rem'
              w='70%'
              size='xs'
              onClick={handleClick}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        w='100%'
        colorScheme='pink'
        mt='20px'
        style={{ marginTop: 20 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Log In
      </Button>
    </VStack>
  );
};

export default Login;
