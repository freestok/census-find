import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react'
import React, { FC } from 'react'
import styles from './DataTable.module.scss'

interface DataTableProps {
  data: any[]
  columns: any[]
  maxLength?: number
  showData: boolean
}

const DataTable: FC<DataTableProps> = ({ data, columns, maxLength, showData }) => (
  <div className={styles.DataTable} data-testid="DataTable">
    <TableContainer>
      <Table variant='striped' colorScheme='gray'>
        {maxLength !== undefined && data.length > maxLength
          ? <TableCaption>Over {maxLength} results, refine your search </TableCaption>
          : <TableCaption>Search Results </TableCaption>
        }
        <Thead>
          <Tr>
            {columns.map(col => (
              <Th key={col}>{col}</Th>
            ))}
            {/* <Th>GEOID</Th>
            <Th>State Abrv.</Th> */}
          </Tr>
        </Thead>
        {(showData && maxLength !== undefined && data.length < maxLength) &&
          <Tbody key={1}>
            {data.map((e: any) => (
              <Tr key={e.geoid}>
                <Td>{e.name}</Td>
                <Td>{e.geoid}</Td>
                <Td>{e.stusps}</Td>
              </Tr>
            ))}
          </Tbody>
        }
      </Table>
    </TableContainer>

  </div>
)

export default DataTable
