import React, { useRef, useEffect } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Box, Avatar, Flex, Tooltip, Text } from '@chakra-ui/react';
import { ifUser, ifLastMessage, ifSameSender } from '../../config/ChatLogics';
import Lottie from 'react-lottie';
import TypingAnimation from '../../animations/chat-typing-indicator.json';

const ScrollableChat = ({ messages, isTyping }) => {
  const { user } = ChatState();
  const bottomRef = useRef(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: TypingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    // scroll to bottomRef every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    messages && (
      <div className='messages'>
        {messages.map((msg, i) => {
          const checkIfUser = ifUser(user, msg);
          const checkIfLastMessage = ifLastMessage(messages, msg, i);
          const checkIfSameSender = ifSameSender(messages, msg, i);

          return (
            <Flex
              className={`align-${checkIfUser}`}
              key={msg._id}
              my={'0.25rem'}
            >
              <Flex alignItems='end'>
                <Box mr={1} minW='32px'>
                  {!checkIfUser && (checkIfLastMessage || checkIfSameSender) && (
                    <Tooltip
                      hasArrow
                      label={msg.sender.name}
                      aria-label='A tooltip'
                      bg='gray.300'
                      color='black'
                    >
                      <Avatar
                        size='sm'
                        name={msg.sender.name}
                        src={msg.sender.displayPhoto}
                      />
                    </Tooltip>
                  )}
                </Box>
                <Text
                  bg={checkIfUser ? 'pink.100' : 'cyan.100'}
                  p={2}
                  fontSize='md'
                  borderRadius='xl'
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.message}
                </Text>
              </Flex>
            </Flex>
          );
        })}
        {isTyping ? (
          <Box maxW='60px' bg='gray.200' borderRadius='2rem' mt={4}>
            <Lottie width={40} height={35} options={defaultOptions} />
          </Box>
        ) : (
          <></>
        )}
        <span ref={bottomRef}></span>
      </div>
    )
  );
};

export default ScrollableChat;
