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
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormItem from "../FormItem";
import * as yup from "yup";
import { cnpj } from "cpf-cnpj-validator";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "@/hooks/useAxios";

const schema = yup.object().shape({
  name: yup.string().required(),
  zipCode: yup.string().required(),
  street: yup.string().required(),
  number: yup.string().required(),
  district: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
});

const LocationForm: React.FC = ({
  isOpen,
  onClose,
  initialValues,
  onSuccess = () => {},
  companyId,
}) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const isEdit = !!initialValues;

  useEffect(() => {
    initialValues ? form.reset(initialValues) : form.reset({});
  }, [initialValues, form.reset, form]);

  const [{ data: postData, loading: postLoading, error: postError }, fetch] =
    useAxios({
      url: isEdit ? `location/${initialValues.id}` : "location",
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
          fetch({ data: { ...data, companyId: Number(companyId) } }).then(
            onSuccess
          )
        )}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor="brand.500" textColor="white" fontSize="2xl">
            Adicionar local
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormItem label="Nome" error={form.formState.errors?.name?.message}>
              <Input {...form.register("name")} />
            </FormItem>
            <SimpleGrid columns={2} gap={4}>
              <GridItem>
                <FormItem
                  label="Cep"
                  error={form.formState.errors?.zipCode?.message}
                >
                  <Input {...form.register("zipCode")} />
                </FormItem>
              </GridItem>
              <GridItem>
                <FormItem
                  label="Número"
                  error={form.formState.errors?.number?.message}
                >
                  <Input {...form.register("number")} />
                </FormItem>
              </GridItem>
              <GridItem>
                <FormItem
                  label="Bairro"
                  error={form.formState.errors?.district?.message}
                >
                  <Input {...form.register("district")} />
                </FormItem>
              </GridItem>
              <FormItem
                label="Rua"
                error={form.formState.errors?.street?.message}
              >
                <Input {...form.register("street")} />
              </FormItem>
              <GridItem>
                <FormItem
                  label="Cidade"
                  error={form.formState.errors?.city?.message}
                >
                  <Input {...form.register("city")} />
                </FormItem>
              </GridItem>
              <GridItem>
                <FormItem
                  label="Estado"
                  error={form.formState.errors?.state?.message}
                >
                  <Input {...form.register("state")} />
                </FormItem>
              </GridItem>
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

export default LocationForm;
