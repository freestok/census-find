import {
  ChakraProvider,
  theme
} from '@chakra-ui/react'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'

export const App = (): any => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
)
