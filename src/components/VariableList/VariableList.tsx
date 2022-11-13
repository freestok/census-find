/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { FC, useEffect, useState } from 'react'
import styles from './VariableList.module.scss'
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
import axios from 'axios'

type ResultStyle = 'top' | 'all'
interface VariableListProps {
  shallow: boolean
  resultStyle: ResultStyle
  resultNumber: number
  filteredData: any
  setFilteredData: React.Dispatch<any>
  setActiveDataset: React.Dispatch<any>
  setActiveYear: React.Dispatch<any>
  setHighLevelList: React.Dispatch<any>
}

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

const VariableList: FC<VariableListProps> = ({
  shallow, resultStyle, resultNumber, filteredData,
  setActiveDataset, setActiveYear, setHighLevelList,
  setFilteredData
}) => {
  const [years, setYears] = useState<any>()
  const [varList, setVarList] = useState<any>()
  const [config, setConfig] = useState<any>()
  // const [filteredData, setFilteredData] = useState<any[]>([])

  const setVariablesFromConfig = async (): Promise<void> => {
    console.log('get variables')
    const res = await axios.get('/api/config')
    console.log('res', res)
    setConfig(res.data)
  }

  const getVariables = async (dataset: any): Promise<void> => {
    console.log('get variables')
    console.log(dataset)
    // get the variables from the backend
    const parameters = {
      type: dataset.name[0],
      year: dataset.varYear[0],
      shallow
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

  const datasetOnChange = (event: any): void => {
    const dataset = config.datasets[event.target.value]
    setActiveDataset(dataset)
    setYears(dataset.years)
    getVariables(dataset)
      .then(() => console.log('got variables'))
      .catch(err => console.error(err))
  }

  const handleSearchChange = (event: any): void => {
    const searchVal = event.target.value.toLowerCase()
    // const data = censusNames[activeGeom]
    const filtered = varList.filter((e: any) => (e.concept.toLowerCase().includes(searchVal)))
    setFilteredData(filtered)
  }

  const yearOnChange = (event: any): void => setActiveYear(event.target.value)

  useEffect(() => {
    setVariablesFromConfig()
      .then(() => console.log('Variables set from config'))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className={styles.VariableList} data-testid="VariableList">
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
                <VariableTable data={filteredData} setHighLevelList={setHighLevelList} />
              </Box>
            </>
          }
        </Stack>

      </Box>
    </div>
  )
}

export default VariableList
