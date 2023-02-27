import CompanyForm from "@/components/CompanyForm/CompanyForm";
import Layout from "@/layout/dashboard";
import AuthGuard from "@/providers/AuthGuard/AuthGuard";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { MdCorporateFare } from "react-icons/md";
import useAxios from "@/hooks/useAxios";
import Table from "@/components/Table/Table";
import { FaArrowLeft, FaPen, FaRegBuilding, FaTrash } from "react-icons/fa";
import BasePagination from "@/components/Paginator/Paginator";
import { useRouter } from "next/router";
import LocationForm from "@/components/LocationForm/LocationForm";
import ModalConfirm from "@/components/ConfirmModal/ConfirmModal";
import Link from "next/link";

const Error = () => <div>error</div>;

const Page: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { query, isReady } = useRouter();
  const [selected, setSelected] = useState(null);

  const {
    isOpen: confirmIsOpen,
    onClose: confirmOnClose,
    onOpen: confirmOnOpen,
  } = useDisclosure();

  const [{ data: getData, loading: getLoading, error: getError }, fetch] =
    useAxios({
      url: `/location/company/${query.id}`,
    });

  const [{ data: companyData }, fetchCompanyById] = useAxios({
    url: `/company/${query.id}`,
  });

  useEffect(() => {
    if (isReady) {
      fetch();
      fetchCompanyById();
    }
  }, [isReady]);

  const onSuccess = () => {
    onClose();
    confirmOnClose();
    fetch({
      params: {
        page: query.page || 1,
      },
    });
  };

  const [{ data: delData, loading: delLoading, error: delError }, fetchDelete] =
    useAxios({
      url: `/location/${selected?.id}`,
      method: "DELETE",
    });

  const handlePageChange = (page: any) => {
    fetch({
      params: {
        page,
      },
    });
  };

  const headers = [
    {
      key: "name",
      title: "Local",
    },
    {
      key: "options",
      title: "Ações",
      selector: (item) => [
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

  return (
    <AuthGuard as={React.Fragment} unauthorizedLayout={Error}>
      <Layout title={`Empresa ${companyData?.name}`} icon={MdCorporateFare}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/companys">
              <Flex alignItems="center">
                <Icon as={FaArrowLeft} mr={2} />
                <Text>Minhas empresas</Text>
              </Flex>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        {isNotEmpty ? (
          <Flex justifyContent={"end"}>
            <Button onClick={() => onOpen()} colorScheme="brand">
              Adicionar Local
            </Button>
          </Flex>
        ) : null}
        {isNotEmpty ? (
          <>
            <Table headers={headers} items={getData?.data || []} />
            <Flex justifyContent={"end"}>
              <BasePagination
                total={getData?.meta.total || 1}
                currentPage={query.page || 1}
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
              Nenhum local cadastrado!
            </Text>
            <Button onClick={() => onOpen()} colorScheme="brand">
              Adicionar Local
            </Button>
          </Flex>
        )}
      </Layout>
      <LocationForm
        initialValues={selected}
        companyId={query.id}
        isOpen={isOpen}
        onSuccess={onSuccess}
        onClose={() => {
          setSelected(null);
          onClose();
        }}
      />
      <ModalConfirm
        isOpen={confirmIsOpen}
        onClose={confirmOnClose}
        header="Confirmação de exclusão"
        message={`O local ${selected?.name} será excluído. Tem certeza dessa ação?`}
        confirmScheme="red"
        confirmText="Excluir"
        onConfirm={() => fetchDelete().then(onSuccess)}
      />
    </AuthGuard>
  );
};

export default Page;
