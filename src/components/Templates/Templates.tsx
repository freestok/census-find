/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC, useEffect, useState } from 'react'
import {
  Grid,
  GridItem,
  Text,
  Stack,
  Center,
  Divider,
  Box,
  Heading,
  useColorModeValue,
  Input,
  Select,
  Flex,
  Button,
  Link,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'

import styles from './Templates.module.scss'
import axios from 'axios'
import DataTable from '../DataTable/DataTable'

// interface TemplatesProps {}
const BoxCard: FC<any> = () => (
  <Box
    maxW={'320px'}
    w={'full'}
    bg={useColorModeValue('white', 'gray.900')}
    boxShadow={'2xl'}
    rounded={'lg'}
    p={6}
    textAlign={'center'}>
  </Box>
)

const VariableTable: FC<any> = ({ data, setHighLevelList }) => {
  const handleButtonClick = (event: any): void => {
    console.log('event', event)
    setHighLevelList((prevState: any) => [...prevState, event.target.value])
  }
  return (
    <Stack align='start'>
      {data.map((e: any) => (
        <Button key={e.name} size='sm' overflow='hidden' textOverflow={'ellipsis'} colorScheme='blue' textAlign={'left'}
          value={e.concept} onClick={handleButtonClick}>
          {e.concept}
        </Button>
      ))}
    </Stack>
  )
}
const Templates: FC<any> = () => {
  const [config, setConfig] = useState<any>()
  const [activeDataset, setActiveDataset] = useState<any>()
  const [years, setYears] = useState<any>()
  const [activeYear, setActiveYear] = useState<any>()
  const [varList, setVarList] = useState<any>()
  const [activeVar, setActiveVar] = useState<any>()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [highLevelList, setHighLevelList] = useState<any[]>([])

  const setVariablesFromConfig = async (): Promise<void> => {
    console.log('get variables')
    const res = await axios.get('/api/config')
    console.log('res', res)
    setConfig(res.data)
  }

  const datasetOnChange = (event: any): void => {
    const dataset = config.datasets[event.target.value]
    setActiveDataset(dataset)
    setYears(dataset.years)
    getVariables(dataset)
      .then(() => console.log('got variables'))
      .catch(err => console.error(err))
  }

  const getVariables = async (dataset: any): Promise<void> => {
    console.log('get variables')
    console.log(dataset)
    // get the variables from the backend
    const parameters = {
      type: dataset.name[0],
      year: dataset.varYear[0],
      shallow: true
    }
    const res = await axios.get('/api/variables', { params: parameters })
    console.log('res.data', res.data)
    setVarList(res.data)
    setFilteredData(res.data)
  }

  const yearOnChange = (event: any): void => setActiveYear(event.target.value)
  const varOnClick = (event: any): void => console.log(event)

  const handleSearchChange = (event: any): void => {
    const searchVal = event.target.value.toLowerCase()
    // const data = censusNames[activeGeom]
    const filtered = varList.filter((e: any) => (e.concept.toLowerCase().includes(searchVal)))
    setFilteredData(filtered)
  }

  useEffect(() => {
    setVariablesFromConfig()
      .then(() => console.log('Variables set from config'))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className={styles.Templates} data-testid="Templates">
      <Grid
        h='80vh'
        templateRows='repeat(2, 1fr)'
        templateColumns='repeat(6, 1fr)'
        gap={4}>
        {/* creation card */}
        <GridItem rowSpan={2} colSpan={3} py={6} ml={2}>
          <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}
            >
            <Stack spacing={8}>

              {config !== undefined &&
                <Select onChange={datasetOnChange}>
                  {activeDataset === undefined && <option value=''> </option>}
                  {config.datasets.map((e: any, index: number) => (
                    <option key={e.name} value={index}>{e.alias}</option>
                  ))}
                </Select>
              }
              {years !== undefined &&
                <Select onChange={yearOnChange}>
                  {activeYear === undefined && <option value=''> </option>}
                  {years.map((e: any) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </Select>
              }
              {varList !== undefined &&
              //   <Select onChange={varOnChange}>
              //   {activeVar === undefined && <option value=''> </option>}
              //   {varList.map((e: any) => (
              //     <option key={e.name} value={e.name}>{e.concept}</option>
              //   ))}
              // </Select>
              <>
                <Input
                  // value={userSearch}
                  onChange={handleSearchChange}
                  variant='filled'
                  placeholder='Search'
                  size='md'
                  mb={5}
                />
                <Box maxHeight='70vh' overflow='auto' overflowX='scroll' maxWidth='100rem'>
                <VariableTable data={filteredData} setHighLevelList={setHighLevelList}/>
                </Box>
              </>
            }
            </Stack>

          </Box>
        </GridItem>
        {/* high level preview */}
        <GridItem rowSpan={2} colSpan={3} py={6} mr={2}>
          <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
            <Box maxHeight='100vh' overflow='auto' overflowX='scroll' maxWidth='100rem'>
              <Stack align='start'>
                {highLevelList.map((e: any) => (
                  <Button key={e}>{e}</Button>
                ))}
              </Stack>
            </Box>
          </Box>

        </GridItem>
      </Grid>
    </div>
  )
}

export default Templates
