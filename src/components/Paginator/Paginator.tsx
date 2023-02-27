import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from "@ajna/pagination";
import { Text } from "@chakra-ui/react";
import React from "react";

const BasePagination: React.FC<any> = ({
  total,
  limits,
  initialState,
  onPageChange,
}) => {
  const { pagesCount, setCurrentPage, currentPage } = usePagination({
    total,
    limits,
    initialState: initialState || {
      currentPage: 1,
      pageSize: 10,
    },
  });

  const handlePageChange = (nextPage: number): void => {
    // -> request new data using the page number
    setCurrentPage(nextPage);
    onPageChange(nextPage);
  };

  return (
    <Pagination
      onPageChange={handlePageChange}
      pagesCount={pagesCount}
      currentPage={currentPage}
    >
      <PaginationContainer align="center" py={4}>
        <Text>Página: {currentPage}</Text>
        <Text mx={2}> Qt por pagina: {initialState?.pageSize || 10}</Text>
        <PaginationPrevious size="sm" colorScheme="gray">
          Anterior
        </PaginationPrevious>
        <PaginationNext size="sm" colorScheme="brand">
          Proxímo
        </PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
};
export default BasePagination;
