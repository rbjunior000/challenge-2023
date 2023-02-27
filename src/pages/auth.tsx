import { FormItem } from "@/components";
import {
  Button,
  Flex,
  GridItem,
  Input,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import logo from "../../public/logo.svg";
import image from "../../public/image.svg";
import { useRouter } from "next/router";
import useAxios from "@/hooks/useAxios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useStorage from "@/hooks/useStorage";
import { useAuth } from "@/providers/AuthProvider/AuthProvider";

const schema = (isSignUp: boolean) =>
  yup.object().shape({
    name: isSignUp ? yup.string().required() : yup.string(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    confirmPassword: isSignUp
      ? yup.string().oneOf([yup.ref("password"), null], "Passwords must match")
      : yup.string(),
  });

const SignUpForm = () => {
  const form = useForm({
    resolver: yupResolver(schema(true)),
  });
  const { push } = useRouter();
  const [
    { data: postData, loading: postLoading, error: postError },
    fetchSignUp,
  ] = useAxios({
    url: "user",
    method: "POST",
  });

  return (
    <form
      onSubmit={form.handleSubmit(({ confirmPassword, ...data }) =>
        fetchSignUp({ data }).then(() =>
          push({
            query: {},
          })
        )
      )}
    >
      <Flex flexDir="column" p="120px">
        <Image src={logo} m="auto" as={NextImage} alt="logo" />
        <FormItem label="Nome" error={form.formState.errors?.name?.message}>
          <Input {...form.register("name")} />
        </FormItem>
        <FormItem label="Email" error={form.formState.errors?.email?.message}>
          <Input type="email" {...form.register("email")} />
        </FormItem>
        <FormItem
          label="Senha"
          error={form.formState.errors?.password?.message}
        >
          <Input type="password" {...form.register("password")} />
        </FormItem>
        <FormItem
          label="Repetir senha"
          error={form.formState.errors?.confirmPassword?.message}
        >
          <Input type="password" {...form.register("confirmPassword")} />
        </FormItem>
        <Button
          mt={2}
          colorScheme="brand"
          mb={2}
          type="submit"
          isLoading={form.formState.isSubmitting}
        >
          Registrar
        </Button>
        <Button
          type="button"
          colorScheme="green"
          onClick={() =>
            push({
              query: {},
            })
          }
        >
          Logar
        </Button>
      </Flex>
    </form>
  );
};

const SignInForm = () => {
  const form = useForm({
    resolver: yupResolver(schema(false)),
  });
  const { signIn } = useAuth();
  const [token, setToken] = useStorage("user_token", "");
  const { push } = useRouter();
  const [{ data: getData, loading: getLoading, error: getError }, fetch] =
    useAxios({
      url: "auth/signIn",
      method: "POST",
    });
  return (
    <form
      onSubmit={form.handleSubmit((data) =>
        fetch({ data }).then((payload: any) => {
          signIn(payload.data);
        })
      )}
    >
      <Flex flexDir="column" p="120px">
        <Image src={logo} m="auto" as={NextImage} alt="logo" />
        <FormItem label="Email" error={form.formState.errors?.email?.message}>
          <Input type="email" {...form.register("email")} />
        </FormItem>
        <FormItem
          label="Senha"
          error={form.formState.errors?.password?.message}
        >
          <Input type="password" {...form.register("password")} />
        </FormItem>
        <Button
          isLoading={form.formState.isSubmitting}
          mt={2}
          colorScheme="brand"
          mb={2}
          type="submit"
        >
          Logar
        </Button>
        <Button
          type="button"
          colorScheme="green"
          onClick={() =>
            push({
              query: {
                action: "signup",
              },
            })
          }
        >
          Criar conta
        </Button>
      </Flex>
    </form>
  );
};

const Auth: React.FC = () => {
  const form = useForm({
    resolver: yupResolver(schema),
  });
  const { query, replace, asPath } = useRouter();

  const isSignUp = query.action === "signup";
  return (
    <SimpleGrid columns={2} minHeight="100vh">
      <GridItem colSpan={1} bgColor="brand.500">
        <Image src={image} as={NextImage} bgColor="brand" alt="image" />
      </GridItem>
      <GridItem colSpan={1}>
        {isSignUp ? <SignUpForm /> : <SignInForm />}
      </GridItem>
    </SimpleGrid>
  );
};

export default Auth;
