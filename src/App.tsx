import {
  ChakraProvider,
  theme
} from '@chakra-ui/react'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CensusData from './components/CensusData/CensusData'
import Explore from './components/Explore/Explore'
import Navbar from './components/Navbar/Navbar'
import Query from './components/Query/Query'
import Templates from './components/Templates/Templates'
import 'mapbox-gl/dist/mapbox-gl.css'

export const App = (): any => (
  <ChakraProvider theme={theme}>
    <Navbar />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Explore/>} />
        <Route path='/explore' element={<Explore/>} />
        <Route path='/templates' element={<Templates/>} />
        <Route path='/query' element={<Query/>} />
        <Route path='/data/:type/:geoid' element={<CensusData/>} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
)
