/* eslint-disable @typescript-eslint/no-unused-vars */

import { Text, Stack, Center, Button, Box, Heading, Link, Avatar, Input, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import styles from './Explore.module.scss'

// interface ExploreProps {}

const Explore: FC<any> = () => {
  useEffect(() => {
  }, [])
  const handleChange = (event: any): void => {
    console.log(event.target.value)
  }
  return (
    <div className={styles.Explore} data-testid="Explore">

      <Center py={6}>
        <Box
          maxW={'320px'}
          w={'full'}
          // bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'lg'}
          p={6}
          textAlign={'center'}>

          <Heading fontSize={'2xl'} fontFamily={'body'}>
            Search for a Place
          </Heading>
          <Text fontWeight={600} color={'gray.500'} mb={4}>
            e.g. state, county, census tract, place
          </Text>
          <Input
            // value={value}
            onChange={handleChange}
            variant='filled'
            placeholder='Search'
            size='md'
          />
          <Stack mt={8} direction={'row'} spacing={4}>
            {/* <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              _focus={{
                bg: 'gray.200'
              }}>
              Message
            </Button> */}
            <Button
              flex={1}
              fontSize={'md'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500'
              }}
              _focus={{
                bg: 'blue.500'
              }}>
              Search
            </Button>
          </Stack>
        </Box>

      </Center>
      {/* table results */}
      <Center>

      <Box
        maxW={'500px'}
        w={'full'}
        // bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}>

        <TableContainer>
          <Table variant='striped' colorScheme='gray'>
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>Geography</Th>
                <Th>Type</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
              </Tr>
              <Tr>
                <Td>feet</Td>
                <Td>centimetres (cm)</Td>
                <Td isNumeric>30.48</Td>
              </Tr>
              <Tr>
                <Td>yards</Td>
                <Td>metres (m)</Td>
                <Td isNumeric>0.91444</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
      </Center>

    </div>
  )
}

export default Explore
