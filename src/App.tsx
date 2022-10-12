import {
  ChakraProvider,
  theme
} from '@chakra-ui/react'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import Navbar from './components/Navbar/Navbar'

export const App = (): any => (
  <ChakraProvider theme={theme}>
    <Navbar />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/explore' element={<Home/>} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
)
