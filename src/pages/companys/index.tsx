import CompanyForm, { Company } from "@/components/CompanyForm/CompanyForm";
import Layout from "@/layout/dashboard";
import AuthGuard from "@/providers/AuthGuard/AuthGuard";
import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { MdCorporateFare } from "react-icons/md";
import useAxios from "@/hooks/useAxios";
import Table from "@/components/Table/Table";
import { FaPen, FaRegBuilding, FaTrash } from "react-icons/fa";
import BasePagination from "@/components/Paginator/Paginator";
import { useRouter } from "next/router";
import ModalConfirm from "@/components/ConfirmModal/ConfirmModal";

const Error = () => <div>error</div>;

const Page: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: confirmIsOpen,
    onClose: confirmOnClose,
    onOpen: confirmOnOpen,
  } = useDisclosure();
  const { query, replace, push } = useRouter();
  const [selected, setSelected] = useState<Company | undefined>(undefined);

  const [{ data: getData, loading: getLoading, error: getError }, fetch] =
    useAxios(
      {
        url: "company",
      },
      {
        manual: false,
      }
    );

  const [{ data: delData, loading: delLoading, error: delError }, fetchDelete] =
    useAxios({
      url: `/company/${selected?.id}`,
      method: "DELETE",
    });

  const onSuccess = () => {
    onClose();
    confirmOnClose();
    fetch({
      params: {
        page: query.page || 1,
      },
    });
  };

  const handlePageChange = (page: any) => {
    push("/companys", {
      query: {
        page,
      },
    });
    fetch({
      params: {
        page,
      },
    });
  };

  const headers = [
    {
      key: "name",
      title: "Nome",
      minW: "550px",
    },
    {
      key: "qty",
      title: "Qt de locais",
    },
    {
      key: "options",
      title: "Ações",
      selector: (item: any) => [
        {
          onClick: () => {
            setSelected(item);
            onOpen();
          },
          label: "Editar empresa",
          icon: FaPen,
        },
        {
          onClick: () => {
            push(`/companys/${item.id}`);
          },
          label: "Criar endereço",
          icon: FaRegBuilding,
        },
        {
          onClick: () => {
            setSelected(item);
            confirmOnOpen();
          },
          label: "Deletar",
          icon: FaTrash,
          color: "red",
        },
      ],
    },
  ];

  const isNotEmpty = useMemo(
    () => !!(getData?.data || []).length || getLoading,
    [getData, getLoading]
  );

  const companyName = useMemo(
    () => (
      <Text as="span" fontWeight={700}>
        {selected?.name}
      </Text>
    ),
    [selected]
  );

  return (
    <AuthGuard as={React.Fragment} unauthorizedLayout={Error}>
      <Layout title="Minhas empresas" icon={MdCorporateFare}>
        {isNotEmpty ? (
          <Flex justifyContent={"end"}>
            <Button mb={4} onClick={() => onOpen()} colorScheme="brand">
              Adicionar empresa
            </Button>
          </Flex>
        ) : null}
        {isNotEmpty ? (
          <>
            <Table headers={headers} items={getData?.data || []} />
            <Flex justifyContent={"end"}>
              <BasePagination
                total={getData?.meta.total || 1}
                initialState={{
                  currentPage: Number(query.page) | 1,
                  pageSize: 10,
                }}
                onPageChange={handlePageChange}
              />
            </Flex>
          </>
        ) : (
          <Flex
            flexDir="column"
            alignItems="center"
            justifyContent={"center"}
            h="100%"
          >
            <Text
              fontWeight={700}
              fontSize="6xl"
              textAlign={"center"}
              maxW="600px"
            >
              Nenhuma empresa cadastrada!
            </Text>
            <Button onClick={() => onOpen()} colorScheme="brand">
              Adicionar Empresa
            </Button>
          </Flex>
        )}
      </Layout>
      <CompanyForm
        initialValues={selected}
        isOpen={isOpen}
        onSuccess={onSuccess}
        onClose={() => {
          setSelected(undefined);
          onClose();
        }}
      />
      <ModalConfirm
        isOpen={confirmIsOpen}
        onClose={confirmOnClose}
        header="Confirmação de exclusão"
        message={
          <Text>
            A empresa {companyName} será excluída. Tem certeza dessa ação?
          </Text>
        }
        confirmScheme="red"
        confirmText="Excluir"
        headerProps={{
          bgColor: "red.500",
          textColor: "white",
        }}
        onConfirm={() => fetchDelete().then(onSuccess)}
      />
    </AuthGuard>
  );
};

export default Page;
