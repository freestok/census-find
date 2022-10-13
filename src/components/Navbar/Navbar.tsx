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
  HStack
} from '@chakra-ui/react'
import { FaBars, FaQuestionCircle, FaWindowClose } from 'react-icons/fa'
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
              size={'md'}
              icon={<Center><FaQuestionCircle /></Center>}
              aria-label={'About Page'}
              color="current"
              variant="ghost"
              onClick={() => alert('This about page does not exist...yet')}
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
      </Box>
    </div>
  )
}

export default Navbar
