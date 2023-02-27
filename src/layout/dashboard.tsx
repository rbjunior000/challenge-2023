import { useAuth } from "@/providers/AuthProvider/AuthProvider";
import {
  Avatar,
  Box,
  Button,
  Flex,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

const HEADER_HEIGHT = "64px";

const Layout: React.FC = ({ title, icon, children }) => {
  const { user, signOut } = useAuth();
  return (
    <SimpleGrid columns={1}>
      <GridItem height={HEADER_HEIGHT} bgColor="white">
        <Flex justifyContent="space-between" h="full">
          <Flex ml={8} alignItems={"center"}>
            <Icon mr={2} as={icon} size="sm" boxSize={8} />
            <Text color="black" fontWeight={700} fontSize="3xl">
              {title}
            </Text>
          </Flex>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaChevronDown />}
              size="lg"
              h="full"
            >
              <Flex alignItems="center">
                <Avatar name={user?.name} />
                <Text ml={2}>{user?.name}</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={signOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
      <GridItem
        minH={`calc(100vh - ${HEADER_HEIGHT})`}
        bgColor="#F5F5F5"
        py={4}
        px={8}
      >
        {children}
      </GridItem>
    </SimpleGrid>
  );
};

export default Layout;
