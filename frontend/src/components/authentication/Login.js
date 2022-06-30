import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react';

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  // For showing password
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // For submit button
  const handleSubmit = () => {};

  return (
    <VStack spacing={3}>
      <FormControl isRequired>
        <FormLabel htmlFor='username'>Username</FormLabel>
        <Input
          focusBorderColor='pink.500'
          id='username'
          placeholder='Enter your username'
          size='md'
          onchange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            id='password'
            placeholder='Enter your password'
            size='md'
            focusBorderColor='pink.500'
            onchange={(e) => setPassword(e.target.value)}
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
        onclick={handleSubmit}
      >
        Log In
      </Button>
    </VStack>
  );
};

export default Login;
