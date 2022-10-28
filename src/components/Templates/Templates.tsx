/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC } from 'react'
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
  const variableSelectOnChange = (event: any): void => {
    console.log(event)
  }

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
              creation card
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
