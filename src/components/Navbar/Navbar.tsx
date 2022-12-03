// /* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC } from 'react'

import styles from './Navbar.module.scss'
import {
  Box,
  Flex,
  useDisclosure,
  useColorModeValue,
  Stack,
  Center,
  Link,
  IconButton,
  HStack,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import { FaBars, FaGithub, FaQuestionCircle, FaWindowClose } from 'react-icons/fa'
import { ColorModeSwitcher } from '../../ColorModeSwitcher'

// interface NavbarProps {}
const Links = ['Explore', 'Query', 'Templates']

const NavLink: any = ({ children }: { children: string }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700')
    }}
    href={`/${children.toLowerCase()}`}>
    {children}
  </Link>
)

const Navbar: FC<any> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const info = useDisclosure()
  return (
    <div className={styles.Navbar} data-testid="Navbar">
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <Center><FaWindowClose /></Center> : <Center><FaBars /></Center>}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            {/* <Box>
              Logo placeholder
            </Box> */}
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <ColorModeSwitcher justifySelf='flex-end' />
            <IconButton
              size={'lg'}
              icon={<Center><FaQuestionCircle /></Center>}
              aria-label={'About Page'}
              color="current"
              variant="ghost"
              onClick={info.onOpen}
            />
            <IconButton
              size={'lg'}
              icon={<Center><FaGithub /></Center>}
              aria-label={'About Page'}
              color="current"
              variant="ghost"
              onClick={(): void => { window.open('https://github.com/freestok/census-find') }}
            />

          </Flex>
        </Flex>

        {isOpen
          ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
            )
          : null}

          {/* modal info */}
        <Modal isOpen={info.isOpen} onClose={info.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>About</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <Text>
                  <strong>Explore</strong>: Use this page to search for geographies via a table or map. Clicking on a geography will take you to its data. Data shown is dependent on your active template.
                </Text>
                <Text>
                  <strong>Query</strong>: If you are looking for geographies that match certain criteria (e.g. all states with an urban population of at least 70%), then this is the page for you.
                </Text>
                <Text>
                  <strong>Templates</strong>: Create templates to view the data you really want to see. Templates can consist of American Community Survey (ACS) or Decennial variables. Once created, you can view your templates in the Explore page.
                </Text>

              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={info.onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  )
}

export default Navbar
