import React from 'react';
import { Stack, Skeleton } from '@chakra-ui/react';

const SearchLoading = () => {
  return (
    <Stack>
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
      <Skeleton borderRadius='lg' height='50px' />
    </Stack>
  );
};

export default SearchLoading;
