import React from 'react';
import { useDisclosure, Image, Text, Flex } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

const UserModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <i onClick={onOpen} class='fa-solid fa-eye'></i>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              gap='10px'
            >
              <Image
                borderRadius='full'
                boxSize='150px'
                src={user.displayPhoto}
                alt={user.name}
              />
              <div style={{ textAlign: 'center' }}>
                <Text as='abbr' fontSize='lg'>
                  {user.name}
                </Text>
                <Text>@{user.username}</Text>
              </div>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button size='sm' colorScheme='teal' onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserModal;
