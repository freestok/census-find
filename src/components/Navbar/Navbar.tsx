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
import { FaBars, FaWindowClose } from 'react-icons/fa'
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

            {/* <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu> */}
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
