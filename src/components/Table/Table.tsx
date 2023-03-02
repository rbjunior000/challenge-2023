import React, { useState, useEffect } from "react";

// import { Dropdown, Checkbox, Radio, Status, Icon, StatusEnum } from '@/components';
import { Table as CTable, Tbody, Td, Th, Tr, Thead } from "@chakra-ui/react";
import RenderActions from "../RenderActions/RenderActions";

const extractItemValue = <T,>(item: T, key?: keyof T): string => {
  if (!key) {
    return "";
  }

  return item[key] as string;
};

const Table = <T,>({
  itemKey = "id" as keyof T,
  selection = "none",
  headers = [],
  items = [],
  sort = "",
  loading = false,
  onSelection = () => {},
  onSort = () => {},
  ...props
}: any) => {
  return (
    <CTable {...props}>
      <Thead>
        <Tr
          textAlign="end"
          bgColor="white"
          boxShadow="base"
          borderRadius={1}
          my="16px"
          h="74px"
        >
          {headers.map((header: any) => (
            <Td key={header.title} textAlign={header.align} minW={header.minW}>
              {header.title}
            </Td>
          ))}
        </Tr>
      </Thead>

      <Tbody opacity={loading ? 0.8 : 1}>
        {items.map((item: any) => (
          <Tr
            key={extractItemValue(item, itemKey)}
            textAlign="end"
            bgColor="white"
            boxShadow="base"
            borderRadius={1}
            my="16px"
          >
            {headers.map((header: any) =>
              header.key === "options" ? (
                <Td
                  key={header.key}
                  textAlign={header.align}
                  minW={header.minW}
                >
                  <RenderActions
                    item={item}
                    actions={
                      header.selector && (header.selector(item) as Array<T>)
                    }
                  />
                </Td>
              ) : (
                <Td
                  minW={header.minW}
                  key={header.key}
                  textAlign={header.align}
                  textColor="gray.500"
                >
                  {header.selector
                    ? header.selector(item)
                    : item[header.key as keyof T]}
                </Td>
              )
            )}
          </Tr>
        ))}
      </Tbody>
    </CTable>
  );
};

export default Table;
