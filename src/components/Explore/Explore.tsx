/* eslint-disable @typescript-eslint/no-unused-vars */

import { Grid, GridItem, Text, Stack, Center, Button, Box, Heading, Link, Avatar, Input, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, HStack, Select } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import styles from './Explore.module.scss'
import axios from 'axios'

// interface ExploreProps {}

const Explore: FC<any> = () => {
  const [states, setStates] = useState([])
  const [counties, setCounties] = useState([])
  const [places, setPlaces] = useState([])
  const [tracts, setTracts] = useState([])
  const [activeGeom, setActiveGeom] = useState([])

  const stateNames = ['AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
    'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
    'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
    'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
    'WV', 'WI', 'WY']

  const getGeographyNames = async (): Promise<void> => {
    const statesRes = await axios.get('http://127.0.0.1:9090/geom/names/states')
    setStates(statesRes.data)
    setActiveGeom(statesRes.data)

    const countiesRes = await axios.get('http://127.0.0.1:9090/geom/names/counties')
    setCounties(countiesRes.data)
    const tractsRes = await axios.get('http://127.0.0.1:9090/geom/names/tracts')
    setTracts(tractsRes.data)
    const placesRes = await axios.get('http://127.0.0.1:9090/geom/names/places')
    setPlaces(placesRes.data)

    console.log('statesRes', statesRes)
    console.log('states', states)
  }
  useEffect(() => {
    getGeographyNames()
      .then(() => console.log('getGeographyNames complete'))
      .catch(err => console.error(err))
  }, [])

  const handleChange = (event: any): void => {
    console.log(event.target.value)
  }

  const geographySelectOnChange = (event: any): void => {
    console.log('event', event)
    const val = event.target.value
    if (val === 'counties') setActiveGeom(counties)
    else if (val === 'states') setActiveGeom(states)
    else if (val === 'places') setActiveGeom(places)
    else if (val === 'tracts') setActiveGeom(tracts)
  }
  return (
    <div className={styles.Explore} data-testid="Explore">
      <Grid
        h='200px'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(6, 1fr)'
        gap={0}
      >
        <GridItem ml={2} mr={2} rowSpan={2} colSpan={2} >
          {/* Search card */}
          <Center py={6}>
            <Box
              // maxW={'320px'}
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
                mb={5}
              />
              <HStack>
                <Text>Geography Type:</Text>
                <Select onChange={geographySelectOnChange}>
                  <option value='states' defaultValue='states'>State</option>
                  <option value='counties'>County</option>
                  <option value='tracts'>Tracts</option>
                  <option value='places'>Places</option>
                </Select>
              </HStack>
              <HStack>
                <Text>State:</Text>
                <Select>
                  <option key={'AL'} value={'AL'}>AL</option>
                  {stateNames.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </Select>
              </HStack>
              <Stack mt={8} direction={'row'} spacing={4}>
                {/* search button */}
                {/* <Button
                flex={1}
                fontSize={'md'}
                rounded={'full'}
                // maxW={'150px'}

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
              </Button> */}
              </Stack>
            </Box>

          </Center>

        </GridItem>
        <GridItem colSpan={4}>
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
                      <Th>Name</Th>
                      <Th>GEOID</Th>
                      <Th>State Abrv.</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {activeGeom.map((e: any) => (
                      <Tr key={e.goid}>
                        <Td>{e.name}</Td>
                        <Td>{e.geoid}</Td>
                        <Td>{e.stusps}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Center>

        </GridItem>
      </Grid>
      {/* <HStack>

      </HStack> */}

    </div>
  )
}

export default Explore
