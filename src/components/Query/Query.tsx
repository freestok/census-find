/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import styles from './Query.module.scss'
import axios from 'axios'
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  HStack,
  Tooltip
} from '@chakra-ui/react'
import VariableList from '../VariableList/VariableList'
import { FaEquals, FaGreaterThan, FaGreaterThanEqual, FaLessThan, FaLessThanEqual, FaRegTimesCircle } from 'react-icons/fa'
import { QueryType, GeomTypes, NumberType } from '../interfaces'

// interface QueryProps {}

const Query: FC<any> = () => {
  const [activeDataset, setActiveDataset] = useState<any>()
  const [activeYear, setActiveYear] = useState<any>()
  const [activeGeom, setActiveGeom] = useState<GeomTypes>('state')
  const [activeState, setActiveState] = useState<any>('AL')
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [highLevelList, setHighLevelList] = useState<any[]>([])
  const [incrementValue, setIncrementValue] = React.useState('0')
  const [numberType, setNumberType] = useState<NumberType>('percent')
  const [queryType, setQueryType] = useState<QueryType>('all')

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

  const format = (val: string): string => `${val}%`
  const parse = (val: string): string => val.replace(/^\$/, '')

  const handleNumberTypeChange = (event: any): void => {
    setNumberType(event.target.value)
    setIncrementValue('0')
  }
  return (
    <div className={styles.Query} data-testid="Query">
            <Grid
        h='80vh'
        templateRows='repeat(2, 1fr)'
        templateColumns='repeat(6, 1fr)'
        gap={4}>
        {/* creation card */}
        <GridItem rowSpan={2} colSpan={2} py={6} ml={2}>
          <VariableList
            setActiveDataset={setActiveDataset}
            setActiveYear={setActiveYear}
            setHighLevelList={setHighLevelList}
            setFilteredData={setFilteredData}
            filteredData={filteredData}
            shallow={false}
            resultNumber={100}
            resultStyle='top'
            title='Query Builder'
            activeGeom={activeGeom}
            setActiveGeom={setActiveGeom}
            setActiveState={setActiveState}/>
        </GridItem>
        {/* high level preview */}
        <GridItem rowSpan={2} colSpan={4} py={6} mr={2}>
          <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}
            >
            <Stack>
              <Heading size='lg' mb={5}>Query Overview</Heading>
              <Text>Enter a name for your template and click finish once complete.</Text>
              <Stack direction={'row'} >
                  <Select maxW='15vw' onChange={(e: any): void => setQueryType(e.target.value)}>
                      <option value={'all'}>All of these are true</option>
                      <option value={'any'}>Any of these are true</option>
                    </Select>
                  <Button colorScheme='green' width='7em' mb={3}
                    // onClick={handleFinish}
                    disabled={(highLevelList.length < 1 || activeYear === undefined) && true}>
                      Run Query
                  </Button>
                </Stack>
                <Divider/>

            </Stack>
            <Box maxHeight='100vh' overflow='auto' overflowX='auto' maxWidth='100rem' mt={5}>
              <Stack align='start'>
                {highLevelList.map((e: any, index: number) => (
                  <HStack key={e.name}>
                    <Tooltip label={`${e.concept} - ${e.label}`}>
                      <Button leftIcon={<FaRegTimesCircle />}
                        width='200px'
                        justifyContent="flex-start"
                        overflow='hidden' textOverflow={'ellipsis'}
                        onClick={() => removeHighLevelList(e, index)}>
                        {e.concept} - {e.label}
                      </Button>
                    </Tooltip>
                    <Select maxW='15vw' onChange={handleNumberTypeChange}>
                      <option value={'percent'}>Percentage</option>
                      <option value={'value'}>Value</option>
                    </Select>
                    <Select placeholder='Select an operator' maxW='15vw'>
                      <option value={'equal'}>equal to</option>
                      <option value={'greater'}>greater than</option>
                      <option value={'less'}>less than</option>
                      <option value={'greaterThanEqual'}>greater than or equal to</option>
                      <option value={'lessThanEqual'}>less than or equal to</option>
                    </Select>
                    {numberType === 'percent'
                      ? <NumberInput
                        onChange={(valueString) => setIncrementValue(parse(valueString))}
                        value={format(incrementValue)}
                        min={0}
                        max={100}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      : <NumberInput
                        onChange={(valueString) => setIncrementValue(parse(valueString))}
                        min={0}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    }
                  </HStack>
                ))}
              </Stack>
            </Box>
          </Box>

        </GridItem>
      </Grid>

    </div>
  )
}

export default Query
