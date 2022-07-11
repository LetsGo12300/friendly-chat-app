import React from 'react';
import { Badge, Button } from '@chakra-ui/react';

const UserBadge = ({ user, handleUserClick }) => {
  return (
    <Badge variant='solid' colorScheme='teal' p={'1px 1px 1px 6px'} m={'1px'}>
      {user.name}
      <Button
        variant='solid'
        colorScheme='teal'
        size='xs'
        onClick={() => handleUserClick(user)}
      >
        <i className='fa-solid fa-xmark'></i>
      </Button>
    </Badge>
  );
};

export default UserBadge;
