
import {
  Text,
  Heading,
  TableContainer,
  Table,
  Spinner,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Center,
  Stack
} from '@chakra-ui/react'
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

type SurveyType = 'acs5' | 'sf1'
interface CensusDataTableProps {
  data: AcsResult[]
  showData: boolean
  type: SurveyType
}

// for ACS Data
const ACSTableGroup: FC<any> = ({ data }) => (
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

// for decennial data
const DecTableGroup: FC<any> = ({ data }) => (
  <>
    <Heading m={5}>{data[0].concept}</Heading>
    <TableContainer>
      <Table variant='striped' colorScheme='gray'>
        <Thead>
          <Tr>
            <Th>Variable</Th>
            <Th>Value</Th>
            <Th>Percent</Th>
          </Tr>
        </Thead>
        <Tbody key={1}>
          {data.map((row: any) => (
            <Tr key={row.variable}>
              <Td pl={4 + (row.tab * 6)}>{row.label}</Td>
              <Td>{row.value?.toLocaleString()}</Td>
              <Td>{row.percent?.toFixed(1)}%</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </>
)

const CensusDataTable: FC<CensusDataTableProps> = ({ data, showData, type }) => {
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

      {type === 'acs5'
        ? <>
          {masterArray.map(group => (
            <ACSTableGroup key={group[0].concept} data={group} />
          ))}
        </>
        : <>
          {masterArray.map(group => (
            <DecTableGroup key={group[0].concept} data={group} />
          ))}
        </>
    }

  </div>
  )
}

export default CensusDataTable
