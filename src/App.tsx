import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import {BrowserRouter, Routes, Route, HashRouter} from "react-router-dom";
import Home from "./components/Home/Home";

export const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
)
