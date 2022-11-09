/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

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
  Tr,
  IconButton,
  Icon,
  ButtonGroup
} from '@chakra-ui/react'
import { FaRegTimesCircle } from 'react-icons/fa'
import styles from './Templates.module.scss'
import axios from 'axios'
import DataTable from '../DataTable/DataTable'
import { CloseIcon } from '@chakra-ui/icons'
// interface TemplatesProps {}

const VariableTable: FC<any> = ({ data, setHighLevelList }) => {
  const [maxRecords, setMaxRecords] = useState<number>(100)

  const handleButtonClick = (record: any): void => {
    record.disabled = true
    setHighLevelList((prevState: any) => [...prevState, record])
  }

  const handleLoadMore = (): void => setMaxRecords(maxRecords + 100)
  return (
    <Stack align='start'>
      {data.slice(0, maxRecords).map((e: any) => (
        <Button key={e.name} size='sm' overflow='hidden' textOverflow={'ellipsis'} colorScheme='blue' textAlign={'left'}
          value={e.concept} onClick={() => handleButtonClick(e)} disabled={e.disabled}>
          {e.concept}
        </Button>
      ))}
      {maxRecords < data.length &&
        <Button onClick={handleLoadMore}>
          Load More
        </Button>
      }
    </Stack>
  )
}
const Templates: FC<any> = () => {
  const [config, setConfig] = useState<any>()
  const [activeDataset, setActiveDataset] = useState<any>()
  const [years, setYears] = useState<any>()
  const [activeYear, setActiveYear] = useState<any>()
  const [varList, setVarList] = useState<any>()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [highLevelList, setHighLevelList] = useState<any[]>([])
  const [templateName, setTemplateName] = useState<string>('')

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

    // res.data = res.data.map((e: any): any => e.disabled = false)
    for (const row of res.data) {
      row.disabled = false
    }
    setVarList(res.data)
    setFilteredData(res.data)
  }

  const yearOnChange = (event: any): void => setActiveYear(event.target.value)
  const handleTemplateName = (event: any): void => setTemplateName(event.target.value)
  const handleSearchChange = (event: any): void => {
    const searchVal = event.target.value.toLowerCase()
    // const data = censusNames[activeGeom]
    const filtered = varList.filter((e: any) => (e.concept.toLowerCase().includes(searchVal)))
    setFilteredData(filtered)
  }

  const removeHighLevelList = (record: any, index: number): void => {
    // loop over the todos list and find the provided id.
    const updatedList = filteredData.map((item: any) => {
      if (item.name === record.name) {
        return { ...item, disabled: false } // gets everything that was already in item, and updates "done"
      }
      return item // else return unmodified item
    })

    setFilteredData(updatedList) // set state to new object with updated list
    setHighLevelList([
      ...highLevelList.slice(0, index),
      ...highLevelList.slice(index + 1)
    ])
  }

  const handleFinish = (): void => {
    const vars = highLevelList.map(e => `${e.name.split('_')[0]}_`)
    const payload = {
      year: activeYear,
      variables: vars,
      template: templateName,
      survey: activeDataset.name[0],
      variableYear: activeDataset.varYear[0]
    }
    // const result = await axios.post('/api/templates', payload)
    console.log('payload', payload)
    postTemplate(payload)
      .then(() => console.log('postTemplate complete'))
      .catch(e => console.error(e))
  }

  const postTemplate = async (payload: any): Promise<void> => {
    const result = await axios.post('/api/templates', payload)
    console.log('result', result)
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
            <Heading size='lg' mb={5}>Template Builder</Heading>
            <Stack spacing={8}>

              {config !== undefined &&
                <Select placeholder='Select a dataset' onChange={datasetOnChange}>
                  {/* {activeDataset === undefined && <option value=''> </option>} */}
                  {config.datasets.map((e: any, index: number) => (
                    <option key={e.name} value={index}>{e.alias}</option>
                  ))}
                </Select>
              }
              {years !== undefined &&
                <Select placeholder='Select a year' onChange={yearOnChange}>
                  {/* {activeYear === undefined && <option value=''> </option>} */}
                  {years.map((e: any) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </Select>
              }
              {varList !== undefined &&
                <>
                  <Heading size='md'>Click a button to add to your template</Heading>
                  <Input
                    // value={userSearch}
                    onChange={handleSearchChange}
                    variant='filled'
                    placeholder='Filter by searching for a variable'
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
              <Stack>
                <Heading size='lg' mb={5}>Template Overview</Heading>
                <Text>Enter a name for your template and click finish once complete.</Text>
                <Stack direction={'row'}>
                  <Input placeholder='Template Name' onChange={handleTemplateName}/>
                  {/* <Center> */}
                    <Button colorScheme='green' width='5em' mb={3}
                      onClick={handleFinish}
                      disabled={(highLevelList.length < 1 || activeYear === undefined || templateName === '') && true}>
                        Finish
                    </Button>

                  {/* </Center> */}
                </Stack>
                <Divider/>
                <Box maxHeight='100vh' overflow='auto' overflowX='auto' maxWidth='100rem'>
                  <Stack align='start'>
                    {highLevelList.map((e: any, index: number) => (
                      <Button textAlign={'left'} leftIcon={<FaRegTimesCircle />} key={e.name} onClick={() => removeHighLevelList(e, index)}>
                        {e.concept}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Stack>
          </Box>

        </GridItem>
      </Grid>
    </div>
  )
}

export default Templates
