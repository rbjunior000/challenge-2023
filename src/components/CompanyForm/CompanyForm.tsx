import {
  Button,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormItem from "../FormItem";
import * as yup from "yup";
import { cnpj } from "cpf-cnpj-validator";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/providers/AuthProvider/AuthProvider";
import InputMask from "react-input-mask";

export interface Company {
  id: number;
  name: string;
  website: string;
  document: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  website: yup.string().required(),
  document: yup
    .string()
    .test("test-invalid-cnpj", "cnpj inválido", (value: any) =>
      cnpj.isValid(value)
    ),
});

const CompanyForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Company;
  onSuccess?: (payload: any) => void;
}> = ({ isOpen, onClose, initialValues, onSuccess = () => {} }) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues || {
      id: 0,
      name: "",
      website: "",
      document: "",
    },
  });
  const { user } = useAuth();

  const isEdit = !!initialValues;

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.reset({
        id: 0,
        name: "",
        website: "",
        document: "",
      });
    }
  }, [initialValues, form]);

  const [{ data: postData, error: postError }, fetch] = useAxios({
    url: isEdit ? `company/${initialValues?.id}` : "company",
    method: isEdit ? "PUT" : "POST",
  });

  const initialRef = React.useRef(null);

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
    >
      <form
        onSubmit={form.handleSubmit((data) =>
          fetch({
            data: {
              ...data,
              userId: user?.id,
            },
          }).then((payload) => {
            onSuccess(payload);
            form.reset({
              id: 0,
              name: "",
              website: "",
              document: "",
            });
          })
        )}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bgColor="brand.500"
            textColor="white"
            fontSize="2xl"
            borderRadius="6px 6px 0 0"
          >
            {isEdit ? "Editar empresa" : "Adicionar empresa"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormItem label="Nome" error={form.formState.errors?.name?.message}>
              <Input {...form.register("name")} />
            </FormItem>
            <SimpleGrid columns={2} gap={4}>
              <GridItem>
                <FormItem
                  label="Website"
                  error={form.formState.errors?.website?.message}
                >
                  <Input {...form.register("website")} />
                </FormItem>
              </GridItem>
              <FormItem
                label="CNPJ"
                error={form.formState.errors?.document?.message}
              >
                <Input
                  as={InputMask}
                  mask="**.***.***/****-**"
                  maskChar={null}
                  {...form.register("document")}
                />
              </FormItem>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="brand"
              mr={3}
              type="submit"
              isLoading={form.formState.isSubmitting}
            >
              {isEdit ? "Editar" : "Adicionar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CompanyForm;
