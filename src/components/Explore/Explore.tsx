/* eslint-disable @typescript-eslint/no-unused-vars */

import { Grid, GridItem, Text, Stack, Center, Divider, Button, Box, Heading, useColorModeValue, Link, Avatar, Input, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, HStack, Select, Flex, StackDivider } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import styles from './Explore.module.scss'
import axios from 'axios'
import DataTable from '../DataTable/DataTable'

// interface ExploreProps {}

interface GeomNameQuery {
  name: string
  geoid: string
  stusps: string
}

interface CensusGeoms {
  states: GeomNameQuery[]
  counties: GeomNameQuery[]
  places: GeomNameQuery[]
  tracts: GeomNameQuery[]
}

interface Templates {
  id: number
  title: string
}
type GeomTypes = 'states' | 'counties' | 'places' | 'tracts'

const DropdownLabel: FC<any> = ({ text }) => (
  <Flex
    w={20}
    h={8}
    align={'center'}
    justify={'center'}
    rounded={'full'}>
    <Text>{text}</Text>
  </Flex>
)
const Explore: FC<any> = () => {
  const [censusNames, setCensusNames] = useState<CensusGeoms>({} as any)
  const [activeGeom, setActiveGeom] = useState<GeomTypes>('states')
  const [activeState, setActiveState] = useState<any>('AL')
  const [filteredData, setFilteredData] = useState<GeomNameQuery[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [templates, setTemplates] = useState<Templates[]>()

  const stateNames = ['AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
    'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
    'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
    'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
    'WV', 'WI', 'WY']

  const getGeomInfo = async (url: string, name: GeomTypes): Promise<void> => {
    const res = await axios.get(url)
    const updatedValObj = { ...censusNames }
    updatedValObj[name] = res.data
    // something[name] = val
    setCensusNames(censusNames => ({
      ...censusNames,
      ...updatedValObj
    }))
  }
  const getGeographyNames = async (): Promise<void> => {
    await getGeomInfo('http://127.0.0.1:9090/geom/names/states', 'states')
    await getGeomInfo('http://127.0.0.1:9090/geom/names/counties', 'counties')
    await getGeomInfo('http://127.0.0.1:9090/geom/names/places', 'places')
    await getGeomInfo('http://127.0.0.1:9090/geom/names/tracts', 'tracts')
  }

  const getTemplates = async (): Promise<void> => {
    const res = await axios.get('http://127.0.0.1:9090/templates/primary')
    setTemplates(res.data)
    console.log('template!', res)
  }

  useEffect(() => {
    getGeographyNames()
      .then(() => console.log('getGeographyNames complete'))
      .catch(err => console.error(err))
    getTemplates()
      .then(() => console.log('getTemplates complete'))
      .catch(err => console.error(err))
  }, [])

  const handleChange = (event: any): void => {
    const searchVal = event.target.value.toLowerCase()
    const data = censusNames[activeGeom]
    let filtered = data.filter((e: GeomNameQuery) => (
      e.name.toLowerCase().includes(searchVal) ||
      e.geoid.includes(searchVal)
    ))
    if (activeGeom !== 'states') {
      filtered = filtered.filter((e: GeomNameQuery) => e.stusps === activeState)
    }
    setFilteredData(filtered)
    setUserSearch(searchVal)
  }

  const geographySelectOnChange = (event: any): void => {
    setActiveGeom(event.target.value)
    setFilteredData([])
    setUserSearch('')
  }

  const stateSelectOnChange = (event: any): void => {
    setActiveState(event.target.value)
    setFilteredData([])
    setUserSearch('')
  }

  const templateSelectOnChange = (event: any): void => {
    console.log('event', event)
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
                by name or GEOID
              </Text>
              <Input
                value={userSearch}
                onChange={handleChange}
                variant='filled'
                placeholder='Search'
                size='md'
                mb={5}
              />
              <Stack spacing={8}>
                <Stack direction={'row'} align={'center'}>
                  <DropdownLabel text='Geography Type:' />
                  <Select onChange={geographySelectOnChange}>
                    <option value='states' defaultValue='states'>State</option>
                    <option value='counties'>County</option>
                    <option value='tracts'>Tracts</option>
                    <option value='places'>Places</option>
                  </Select>
                </Stack>
                <Stack direction={'row'} align={'center'}>
                  <DropdownLabel text='State:' />
                  <Select onChange={stateSelectOnChange}>
                    <option key={'AL'} value={'AL'}>AL</option>
                    {stateNames.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </Select>
                </Stack>
                <Divider
                    borderColor={useColorModeValue('gray.300', 'gray.700')}
                  />
                <Stack direction={'row'} align={'center'}>
                  <DropdownLabel text='Template:' />
                  <Select onChange={templateSelectOnChange}>
                    {templates?.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </Select>
                </Stack>
              </Stack>

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
        <GridItem ml={2} mr={2} colSpan={4}>
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
              <DataTable
                columns={['Name', 'GEOID', 'State Abrv.']}
                data={filteredData}
                maxLength={250}
                showData={userSearch !== ''} />
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
