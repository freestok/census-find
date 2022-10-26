import { TableContainer, Table, TableCaption, Spinner, Thead, Tr, Th, LinkBox, LinkOverlay, Tbody, Td, useColorModeValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import styles from './CensusDataTable.module.scss'

interface CensusDataTableProps {
  data: any[]
  columns: any[]
  columnHeaders: any[]
  showData: boolean
  maxLength?: number
  link?: boolean
  spinnerForNoData: boolean

}

const TableBody: FC<any> = ({ data, columns }) => (
  <Tbody key={1}>
    {data.map((row: any) => {
      return (row.link === undefined)
        ? <Tr key={row[columns[0]]}>
            {columns.map((key: any) => (
              <Td key={key}>{row[key]}</Td>
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

const CensusDataTable: FC<CensusDataTableProps> = ({ data, columns, maxLength, showData, columnHeaders, spinnerForNoData }) => (
  <div className={styles.CensusDataTable} data-testid="CensusDataTable">
    <TableContainer>
      <Table variant='striped' colorScheme='gray'>
        {maxLength !== undefined && data.length > maxLength
          ? <TableCaption>Over {maxLength} results, refine your search </TableCaption>
          : <TableCaption>
            Search Results
            {(!showData && spinnerForNoData) ? <Spinner ml={4} /> : null}
          </TableCaption>
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

export default CensusDataTable
