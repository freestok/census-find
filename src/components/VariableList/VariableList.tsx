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
  ButtonGroup,
  Collapse,
  RadioGroup,
  Radio,
  Tooltip
} from '@chakra-ui/react'
import axios from 'axios'

type ResultStyle = 'top' | 'all'
interface VariableListProps {
  shallow: boolean
  resultStyle: ResultStyle
  resultNumber: number
  filteredData: any
  title: string
  setFilteredData: React.Dispatch<any>
  setActiveDataset: React.Dispatch<any>
  activeDataset: any
  setActiveYear: React.Dispatch<any>
  setHighLevelList: React.Dispatch<any>
  setActiveGeom?: React.Dispatch<any>
  activeGeom?: string
  setActiveState?: React.Dispatch<any>
  setState?: React.Dispatch<any>
}

interface VarInterface {
  label: string
  name: string
  concept: string
  disabled: boolean
}

interface VariableTableInterface {
  data: any
  setHighLevelList: React.Dispatch<any>
  resultStyle: ResultStyle
  resultNumber: number
}

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

const VariableTable: FC<VariableTableInterface> = ({ data, setHighLevelList, resultStyle, resultNumber }) => {
  const [maxRecords, setMaxRecords] = useState<number>(resultNumber)

  const handleButtonClick = (record: any): void => {
    record.disabled = true
    setHighLevelList((prevState: any) => [...prevState, record])
  }

  const handleLoadMore = (): void => setMaxRecords(maxRecords + resultNumber)
  return (
    <Stack align='start'>
      {data.slice(0, maxRecords).map((e: VarInterface) => (
        <Button key={e.name} size='sm' overflow='hidden' textOverflow={'ellipsis'} colorScheme='blue' textAlign={'left'}
          value={e.concept} onClick={() => handleButtonClick(e)} disabled={e.disabled}>
          {resultStyle === 'all'
            ? <Tooltip label={e.name} aria-label='A tooltip'>{e.concept}</Tooltip>
            : <Tooltip label={e.name} aria-label='A tooltip'>
               {`${e.concept} - ${e.label}`}
              </Tooltip>
          }
        </Button>
      ))}
      {(maxRecords < data.length && resultStyle === 'all') &&
        <Button onClick={handleLoadMore}>
          Load More
        </Button>
      }
    </Stack>
  )
}

const VariableList: FC<VariableListProps> = ({
  shallow, resultStyle, resultNumber, filteredData,
  setActiveDataset, setActiveYear, setHighLevelList, activeDataset,
  setFilteredData, title, setActiveGeom, setActiveState, activeGeom
}) => {
  const [years, setYears] = useState<any>()
  const [varList, setVarList] = useState<any>()
  const [config, setConfig] = useState<any>()
  const [radioValue, setRadioValue] = useState('P')
  // const [filteredData, setFilteredData] = useState<any[]>([])

  const stateNames = ['AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
    'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
    'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
    'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
    'WV', 'WI', 'WY']

  const setVariablesFromConfig = async (): Promise<void> => {
    console.log('get variables')
    const res = await axios.get(`${process.env.REACT_APP_API}/config`)
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
    const res = await axios.get(`${process.env.REACT_APP_API}/variables`, { params: parameters })
    console.log('res.data', res.data)

    // res.data = res.data.map((e: any): any => e.disabled = false)
    for (const row of res.data) {
      row.disabled = false
    }
    setVarList(res.data)
    console.log('activeDataset', activeDataset)
    if (dataset.name[0] === 'sf1') {
      res.data = res.data.filter((e: VarInterface) => e.name[0] === radioValue)
    }
    setFilteredData(res.data)
  }

  const datasetOnChange = (event: any): void => {
    const dataset = config.datasets[event.target.value]
    console.log('dataset', dataset)
    setActiveDataset(dataset)
    setYears(dataset.years)
    getVariables(dataset)
      .then(() => console.log('got variables'))
      .catch(err => console.error(err))
  }

  const handleSearchChange = (event: any): void => {
    const searchVal = event.target.value.toLowerCase()
    let filtered = activeDataset.name[0] === 'sf1'
      ? varList.filter((e: VarInterface) => e.name[0] === radioValue)
      : varList
    filtered = filtered.filter((e: VarInterface) => {
      const { concept, name, label } = e
      const fullLabel: string = `${concept} - ${label}`
      return fullLabel.toLowerCase().includes(searchVal) ||
          name.toLowerCase().includes(searchVal) ||
          concept.toLowerCase().includes(searchVal) ||
          label.toLowerCase().includes(searchVal)
    })
    setFilteredData(filtered)
  }

  const radioGroupChange = (event: string): void => {
    setRadioValue(event)
    console.log('evvent', event)
    const filtered = varList.filter((e: VarInterface) => e.name[0] === event)
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
        <Heading size='lg' mb={5}>{title}</Heading>
        <Stack spacing={8}>

          {config !== undefined &&
            <Stack direction={'row'} align={'center'}>
              <DropdownLabel text='Dataset:' />
              <Select placeholder='Select a dataset' onChange={datasetOnChange}>
                {/* {activeDataset === undefined && <option value=''> </option>} */}
                {config.datasets.map((e: any, index: number) => (
                  <option key={e.name} value={index}>{e.alias}</option>
                ))}
              </Select>
            </Stack>
          }
          {(setActiveGeom !== undefined && setActiveState !== undefined) &&
            <>
              <Stack direction={'row'} align={'center'}>
                <DropdownLabel text='Geography Type:' />
                <Select onChange={(e: any): void => setActiveGeom(e.target.value)}>
                  <option value='state' defaultValue='state'>State</option>
                  <option value='county'>County</option>
                  <option value='tract'>Tracts</option>
                  <option value='place'>Places</option>
                </Select>
              </Stack>
              <Stack direction={'row'} align={'center'}
                hidden={activeGeom === 'state'}>
                <DropdownLabel text='State:' />
                <Select onChange={(e: any): void => setActiveState(e.target.value)}>
                  <option key={'AL'} value={'AL'}>AL</option>
                  {stateNames.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </Select>
              </Stack>
            </>
          }
          {years !== undefined &&
            <Collapse in={years !== undefined} animateOpacity>
              <Stack direction={'row'} align={'center'}>
                <DropdownLabel text='Year:' />
                <Select placeholder='Select a year' onChange={yearOnChange}>
                  {/* {activeYear === undefined && <option value=''> </option>} */}
                  {years.map((e: any) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </Select>
              </Stack>
            </Collapse>
          }
          <Collapse in={varList !== undefined} animateOpacity>
            <Heading size='md' mb={3}>Click a button to add to your {resultStyle === 'all' ? 'template' : 'query'}</Heading>
            { activeDataset?.name[0] === 'sf1' &&
              <RadioGroup onChange={radioGroupChange} value={radioValue}>
                <Stack direction='row'>
                  <Radio value='P'>Population</Radio>
                  <Radio value='H'>Housing</Radio>
                </Stack>
              </RadioGroup>
            }
            <Input
              // value={userSearch}
              onChange={handleSearchChange}
              variant='filled'
              placeholder='Filter by searching for a variable'
              size='md'
              mb={5}
            />
            <Box maxHeight='70vh' overflow='auto' overflowX='scroll' maxWidth='100rem'>
              <VariableTable data={filteredData} setHighLevelList={setHighLevelList}
                resultNumber={resultNumber}
                resultStyle={resultStyle}/>
            </Box>
          </Collapse>
        </Stack>

      </Box>
    </div>
  )
}

export default VariableList
