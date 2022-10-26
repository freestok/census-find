/* eslint-disable @typescript-eslint/no-unused-vars */

import { TableContainer, Table, TableCaption, Spinner, Thead, Tr, Th, LinkBox, LinkOverlay, Tbody, Td, useColorModeValue } from '@chakra-ui/react'
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

interface TableBodyProps {
  data: AcsResult[]
}

const TableBody: FC<TableBodyProps> = ({ data }) => (
  <Tbody key={1}>
    {data.map((row) => (
      <Tr key={row.variable}>
        <Td>{row.label}</Td>
        <Td>{row.estimate}</Td>
        <Td>{row.percent}</Td>
        <Td>{row.moe}</Td>
        <Td>{row.moe_perc}</Td>
      </Tr>
    ))}
  </Tbody>
)

const CensusDataTable: FC<CensusDataTableProps> = ({ data, showData }) => (
  <div className={styles.CensusDataTable} data-testid="CensusDataTable">
    <TableContainer>
      <Table variant='striped' colorScheme='gray'>
        <TableCaption>
          Search Results
          {!showData ? <Spinner ml={4} /> : null}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Variable</Th>
            <Th>Estimate</Th>
            <Th>Percent</Th>
            <Th>MoE</Th>
            <Th>MoE %</Th>
          </Tr>
        </Thead>
        {(showData) &&
          <TableBody data={data} />
        }
      </Table>
    </TableContainer>

  </div>
)

export default CensusDataTable
