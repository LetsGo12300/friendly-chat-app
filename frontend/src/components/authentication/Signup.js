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

const Signup = () => {
  // For user input values
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [displayPhoto, setDisplayPhoto] = useState();

  // For showing password
  const [show1, setShow1] = useState(false);
  const handleClick1 = () => setShow1(!show1);

  // For showing confirm password
  const [show2, setShow2] = useState(false);
  const handleClick2 = () => setShow2(!show2);

  // For uploading of display photo
  const uploadPhoto = (images) => {};

  // For submit button
  const handleSubmit = () => {};

  return (
    <VStack spacing={3}>
      <FormControl isRequired>
        <FormLabel htmlFor='full-name'>Full name</FormLabel>
        <Input
          focusBorderColor='pink.500'
          id='full-name'
          placeholder='Enter your full name'
          size='md'
          onchange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='username'>Username</FormLabel>
        <Input
          focusBorderColor='pink.500'
          id='username'
          placeholder='Enter a username'
          size='md'
          onchange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            pr='4.5rem'
            type={show1 ? 'text' : 'password'}
            id='password'
            placeholder='Enter password'
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
              onClick={handleClick1}
            >
              {show1 ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='confirm-password'>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            pr='4.5rem'
            type={show2 ? 'text' : 'password'}
            id='confirm-password'
            placeholder='Confirm password'
            size='md'
            focusBorderColor='pink.500'
            onchange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button
              colorScheme='whiteAlpha'
              h='1.75rem'
              w='70%'
              size='xs'
              onClick={handleClick2}
            >
              {show2 ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type='file'
          p={1}
          accept='image/*'
          onChange={(e) => uploadPhoto(e.target.files[0])}
        />
      </FormControl>
      <Button
        w='100%'
        colorScheme='pink'
        mt='20px'
        style={{ marginTop: 20 }}
        onclick={handleSubmit}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
