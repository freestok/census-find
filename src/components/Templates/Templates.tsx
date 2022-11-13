/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { FC, useEffect, useState } from 'react'
import {
  Grid,
  GridItem,
  Text,
  Stack,
  Divider,
  Box,
  Heading,
  useColorModeValue,
  Input,
  Button
} from '@chakra-ui/react'
import { FaRegTimesCircle } from 'react-icons/fa'
import styles from './Templates.module.scss'
import axios from 'axios'
import VariableList from '../VariableList/VariableList'
// interface TemplatesProps {}

const Templates: FC<any> = () => {
  const [activeDataset, setActiveDataset] = useState<any>()
  const [activeYear, setActiveYear] = useState<any>()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [highLevelList, setHighLevelList] = useState<any[]>([])
  const [templateName, setTemplateName] = useState<string>('')

  const handleTemplateName = (event: any): void => setTemplateName(event.target.value)

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

  const handleFinish = (): void => {
    const vars = highLevelList.map(e => `${e.name.split('_')[0]}_`)
    const payload = {
      year: activeYear,
      variables: vars,
      template: templateName,
      survey: activeDataset.name[0],
      variableYear: activeDataset.varYear[0]
    }
    // const result = await axios.post('/api/templates', payload)
    console.log('payload', payload)
    postTemplate(payload)
      .then(() => console.log('postTemplate complete'))
      .catch(e => console.error(e))
  }

  const postTemplate = async (payload: any): Promise<void> => {
    const result = await axios.post('/api/templates', payload)
    console.log('result', result)
  }

  useEffect(() => {
  }, [])

  return (
    <div className={styles.Templates} data-testid="Templates">
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
            shallow={true}
            resultNumber={100}
            resultStyle='all' />
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
                <Stack direction={'row'}>
                  <Input placeholder='Template Name' onChange={handleTemplateName}/>
                  {/* <Center> */}
                    <Button colorScheme='green' width='5em' mb={3}
                      onClick={handleFinish}
                      disabled={(highLevelList.length < 1 || activeYear === undefined || templateName === '') && true}>
                        Finish
                    </Button>

                  {/* </Center> */}
                </Stack>
                <Divider/>
                <Box maxHeight='100vh' overflow='auto' overflowX='auto' maxWidth='100rem'>
                  <Stack align='start'>
                    {highLevelList.map((e: any, index: number) => (
                      <Button textAlign={'left'} leftIcon={<FaRegTimesCircle />} key={e.name} onClick={() => removeHighLevelList(e, index)}>
                        {e.concept}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Stack>
          </Box>

        </GridItem>
      </Grid>
    </div>
  )
}

export default Templates
