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
  link?: string
}

interface CensusGeoms {
  state: GeomNameQuery[]
  county: GeomNameQuery[]
  place: GeomNameQuery[]
  tract: GeomNameQuery[]
}

interface Templates {
  id: number
  title: string
}
type GeomTypes = 'state' | 'county' | 'place' | 'tract'

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
  const [activeGeom, setActiveGeom] = useState<GeomTypes>('state')
  const [activeState, setActiveState] = useState<any>('AL')
  const [activeTemplate, setActiveTemplate] = useState<number>(0)
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
    await getGeomInfo('http://127.0.0.1:9090/geom/names/states', 'state')
    await getGeomInfo('http://127.0.0.1:9090/geom/names/counties', 'county')
    await getGeomInfo('http://127.0.0.1:9090/geom/names/places', 'place')
    await getGeomInfo('http://127.0.0.1:9090/geom/names/tracts', 'tract')
  }

  const getTemplates = async (): Promise<void> => {
    const res = await axios.get('http://127.0.0.1:9090/templates/primary')
    const data: Templates[] = res.data
    setTemplates(data)
    setActiveTemplate(data[0].id)
    console.log('res.data.id', data[0].id)
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
      e.geoid.includes(searchVal) ||
      e.stusps.toLowerCase().includes(searchVal)
    ))
    if (activeGeom !== 'state') {
      filtered = filtered.filter((e: GeomNameQuery) => e.stusps === activeState)
    }

    // assign link info
    for (const row of filtered) {
      row.link = `/data/${activeGeom}/${row.geoid}?template=${activeTemplate}`
    }
    setFilteredData(filtered)
    setUserSearch(event.target.value)
  }

  const geographySelectOnChange = (event: any): void => {
    setActiveGeom(event.target.value)
    console.log(event.target.value)
    console.log(activeGeom)
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
                    <option value='state' defaultValue='state'>State</option>
                    <option value='county'>County</option>
                    <option value='tract'>Tracts</option>
                    <option value='place'>Places</option>
                  </Select>
                </Stack>
                <Stack direction={'row'} align={'center'}
                  hidden={activeGeom === 'state'}>
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
              <DataTable
                columnHeaders={['Name', 'GEOID', 'State Abrv.']}
                columns={['name', 'geoid', 'stusps']}
                data={filteredData}
                maxLength={250}
                showData={userSearch !== ''}
                link={true}
                spinnerForNoData={false}/>
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
