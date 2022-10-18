/* eslint-disable @typescript-eslint/no-unused-vars */

import { LinkBox, LinkOverlay, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Link, useColorModeValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import styles from './DataTable.module.scss'

interface DataTableProps {
  data: any[]
  columns: any[]
  columnHeaders: any[]
  showData: boolean
  maxLength?: number
  link?: boolean
}

const TableBody: FC<any> = ({ data, columns }) => (
  <Tbody key={1}>
    {data.map((row: any) => {
      return (row.link === undefined)
        ? <Tr key={row}>
            {columns.map((key: any) => (
              <Td key={row[key]}>{row[key]}</Td>
            ))}
        </Tr>
        : <LinkBox key={row.link} as={Tr}
            _hover={{
              // background: 'green.300',
              color: useColorModeValue('teal.300', 'teal.200')
            }}>
            {columns.map((key: string, index: number) => (
              (index === 0)
                ? <Td key={`${key}-${index}`}>
                    <LinkOverlay href={row.link}>
                      {row[key]}
                    </LinkOverlay>
                  </Td>
                : <Td key={`${key}-${index}`}>{row[key]}</Td>
            ))}
        </LinkBox>
    })}
  </Tbody>
)
const DataTable: FC<DataTableProps> = ({ data, columns, maxLength, showData, columnHeaders }) => (
  <div className={styles.DataTable} data-testid="DataTable">
    <TableContainer>
      <Table variant='striped' colorScheme='gray'>
        {maxLength !== undefined && data.length > maxLength
          ? <TableCaption>Over {maxLength} results, refine your search </TableCaption>
          : <TableCaption>Search Results </TableCaption>
        }
        <Thead>
          <Tr>
            {columnHeaders.map(col => (
              <Th key={col}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        {(showData && maxLength !== undefined && data.length < maxLength) &&
          <TableBody data={data} columns={columns} />
        }
      </Table>
    </TableContainer>

  </div>
)

export default DataTable
