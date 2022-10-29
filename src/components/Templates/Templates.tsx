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
  Link
} from '@chakra-ui/react'

import styles from './Templates.module.scss'
import axios from 'axios'

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
const Templates: FC<any> = () => {
  const [config, setConfig] = useState<any>()
  const [activeDataset, setActiveDataset] = useState<any>()
  const [years, setYears] = useState<any>()
  const [activeYear, setActiveYear] = useState<any>()
  const [varList, setVarList] = useState<any>()
  const [activeVar, setActiveVar] = useState<any>()

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
  }

  const yearOnChange = (event: any): void => setActiveYear(event.target.value)
  const varOnChange = (event: any): void => console.log(event.target.value)

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
        <GridItem rowSpan={2} colSpan={2} py={6} ml={2}>
          <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
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
                <Select onChange={varOnChange}>
                {activeVar === undefined && <option value=''> </option>}
                {varList.map((e: any) => (
                  <option key={e.name} value={e.name}>{e.concept}</option>
                ))}
              </Select>
            }
            </Stack>

          </Box>
        </GridItem>
        {/* table preview */}
        <GridItem rowSpan={2} colSpan={3} py={6}>
          <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
            table preview
          </Box>

        </GridItem>
        {/* high level preview */}
        <GridItem rowSpan={2} colSpan={1} py={6} mr={2}>
          <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
            high level preview
          </Box>

        </GridItem>
      </Grid>
    </div>
  )
}

export default Templates
