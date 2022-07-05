import React from 'react';
import { Box, Text, Avatar, Flex } from '@chakra-ui/react';

const UserResult = ({ user, handleUserClick }) => {
  return (
    <Flex
      alignItems='center'
      gap={3}
      bg='gray.100'
      mb={2}
      p={2}
      borderRadius='lg'
      cursor='pointer'
      _hover={{
        background: 'gray.300',
      }}
      onClick={() => handleUserClick(user._id)}
    >
      <Avatar name={user.name} src={user.displayPhoto} />
      <Box>
        <Text fontWeight='medium' color='black'>
          {user.name}
        </Text>
        <Text fontSize='sm'>
          Username:
          <Text as='span' ml={1} color='teal.700'>
            {user.username}
          </Text>
        </Text>
      </Box>
    </Flex>
  );
};

export default UserResult;
