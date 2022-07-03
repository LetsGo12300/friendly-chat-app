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

const Signup = () => {
  // For user input values
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayPhoto, setDisplayPhoto] = useState();

  // For button loading animation
  const [loading, setLoading] = useState(false);

  // Chakra UI toast
  const toast = useToast();

  // For showing password
  const [show1, setShow1] = useState(false);
  const handleClick1 = () => setShow1(!show1);

  // For showing confirm password
  const [show2, setShow2] = useState(false);
  const handleClick2 = () => setShow2(!show2);

  // For uploading of display photo
  const uploadPhoto = (images) => {
    setLoading(true);
    if (images.type === 'image/jpeg' || images.type === 'image/png') {
      const data = new FormData();
      data.append('file', images);
      data.append('upload_preset', 'friendly-app');
      data.append('cloud_name', 'dm5pq9l7b');
      fetch('https://api.cloudinary.com/v1_1/dm5pq9l7b/image/upload', {
        method: 'POST',
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          setDisplayPhoto(data.url);
          setLoading(false);
        });
    } else {
      // pop up an error if uploaded file is not jpeg or png
      toast({
        title: 'Please select a valid image',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  // For submit button
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        name,
        username,
        password,
        confirmPassword,
        displayPhoto,
      };
      const config = { headers: { 'Content-type': 'application/json' } };
      const user = await axios.post('/signup', data, config);
      toast({
        title: 'User signed up successfully!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoading(false);
    } catch (err) {
      toast({
        title: 'User failed to sign up!',
        description: err.response.data.message,
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
        <FormLabel htmlFor='full-name'>Full name</FormLabel>
        <Input
          value={name}
          focusBorderColor='pink.500'
          id='full-name'
          placeholder='Enter your full name'
          size='md'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='username-signup'>Username</FormLabel>
        <Input
          value={username}
          focusBorderColor='pink.500'
          id='username-signup'
          placeholder='Enter a username'
          size='md'
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='password-signup'>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            value={password}
            pr='4.5rem'
            type={show1 ? 'text' : 'password'}
            id='password-signup'
            placeholder='Enter password'
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
            value={confirmPassword}
            pr='4.5rem'
            type={show2 ? 'text' : 'password'}
            id='confirm-password'
            placeholder='Confirm password'
            size='md'
            focusBorderColor='pink.500'
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        <FormLabel>Upload your Picture (optional)</FormLabel>
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
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
