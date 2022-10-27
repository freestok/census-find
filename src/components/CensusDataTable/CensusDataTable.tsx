/* eslint-disable @typescript-eslint/no-unused-vars */

import { Text, Heading, TableContainer, Table, TableCaption, Spinner, Thead, Tr, Th, LinkBox, LinkOverlay, Tbody, Td, useColorModeValue, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Center, Stack } from '@chakra-ui/react'
import React, { FC } from 'react'
import styles from './CensusDataTable.module.scss'

interface AcsResult {
  GEOID: string
  variable: string
  estimate: number
  moe: number
  percent: number
  moe_perc: number
  label: string
  concept: string
  tab: number
}

interface CensusDataTableProps {
  data: AcsResult[]
  showData: boolean
}

const TableGroup: FC<any> = ({ data }) => (
  <>
    <Heading m={5}>{data[0].concept}</Heading>
    <TableContainer>
      <Table variant='striped' colorScheme='gray'>
        <Thead>
          <Tr>
            <Th>Variable</Th>
            <Th>Estimate</Th>
            <Th>Percent</Th>
            <Th>MoE</Th>
            <Th>MoE %</Th>
          </Tr>
        </Thead>
        <Tbody key={1}>
          {data.map((row: any) => (
            <Tr key={row.variable}>
              <Td pl={4 + (row.tab * 6)}>{row.label}</Td>
              <Td>{row.estimate?.toLocaleString()}</Td>
              <Td>{row.percent?.toFixed(1)}%</Td>
              <Td>{row.moe !== undefined ? '± ' : ''}{row.moe?.toLocaleString()}</Td>
              <Td>{row.moe_perc?.toFixed(1)}{row.moe_perc !== undefined ? '%' : ''}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </>
)

const CensusDataTable: FC<CensusDataTableProps> = ({ data, showData }) => {
  const masterArray = []
  const uniqueConcepts = [...new Set(data.map(item => item.concept))]

  for (const concept of uniqueConcepts) {
    const conceptGroup = data.filter(e => e.concept === concept)
    masterArray.push(conceptGroup)
  }

  console.log('masterArray', masterArray)
  return (
  <div className={styles.CensusDataTable} data-testid="CensusDataTable">
    {(!showData)
      ? <Center mt={5}>
      <Stack>
        <Text>Loading Data</Text>
        <Center>
          <Spinner ml={4} />
        </Center>
      </Stack>
    </Center>
      : null}
    { masterArray.map(group => (
      <TableGroup key={group[0].concept} data={group}/>
    ))}
  </div>
  )
}

export default CensusDataTable
