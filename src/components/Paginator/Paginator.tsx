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

interface BasePaginationProps {
  total: number;
  limits?: {
    inner: number;
    outer: number;
  };
  initialState?: { currentPage: number; pageSize: number };
  onPageChange: (nextPage: number) => void;
}

const BasePagination: React.FC<BasePaginationProps> = ({
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
          Próximo
        </PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
};

export default BasePagination;
