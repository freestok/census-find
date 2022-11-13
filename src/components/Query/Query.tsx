/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { FC, useEffect, useState } from 'react'
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
  ButtonGroup
} from '@chakra-ui/react'
import VariableList from '../VariableList/VariableList'
// interface QueryProps {}

const Query: FC<any> = () => {
  const [activeDataset, setActiveDataset] = useState<any>()
  const [activeYear, setActiveYear] = useState<any>()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [highLevelList, setHighLevelList] = useState<any[]>([])
  const [templateName, setTemplateName] = useState<string>('')

  return (
    <div className={styles.Query} data-testid="Query">
            <Grid
        h='80vh'
        templateRows='repeat(2, 1fr)'
        templateColumns='repeat(6, 1fr)'
        gap={4}>
        {/* creation card */}
        <GridItem rowSpan={2} colSpan={3} py={6} ml={2}>
          <VariableList
            setActiveDataset={setActiveDataset}
            setActiveYear={setActiveYear}
            setHighLevelList={setHighLevelList}
            setFilteredData={setFilteredData}
            filteredData={filteredData}
            shallow={false}
            resultNumber={100}
            resultStyle='top'
            title='Query Builder' />
        </GridItem>
        {/* high level preview */}
        <GridItem rowSpan={2} colSpan={3} py={6} mr={2}>
          <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
              <Stack>
                <Heading size='lg' mb={5}>Template Overview</Heading>
                <Text>Enter a name for your template and click finish once complete.</Text>
          </Stack>
          </Box>

        </GridItem>
      </Grid>

    </div>
  )
}

export default Query
