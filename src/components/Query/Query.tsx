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
// interface QueryProps {}

const Query: FC<any> = () => {
  return (
    <div className={styles.Query} data-testid="Query">
    </div>
  )
}

export default Query
