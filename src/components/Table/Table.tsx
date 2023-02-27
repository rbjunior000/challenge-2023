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
    <CTable
      sx={{
        borderCollapse: "separate",
        borderSpacing: "0px 10px",
      }}
      {...props}
    >
      <Thead>
        <Tr>
          {headers.map((header: any) => (
            <Td key={header.title} textAlign={header.align}>
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
                <Td key={header.key} textAlign={header.align}>
                  <RenderActions
                    item={item}
                    actions={
                      header.selector && (header.selector(item) as Array<T>)
                    }
                  />
                </Td>
              ) : (
                <Td
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
