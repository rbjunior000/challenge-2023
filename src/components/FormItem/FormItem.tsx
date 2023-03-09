import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import React, { ReactNode, useMemo } from "react";

interface FormItemProps {
  label: string;
  error?: string;
  helperText?: string;
  inline?: boolean;
  labelProps?: any;
  children: ReactNode;
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  children,
  error,
  helperText,
  inline,
  labelProps = {},
}) => {
  const display = useMemo(() => (inline ? "flex" : "block"), [inline]);
  const marginRight = useMemo(() => (inline ? 1 : 0), [inline]);
  return (
    <FormControl display={display} alignItems="center" isInvalid={!!error}>
      <Flex alignItems="center" mr={marginRight}>
        <FormLabel m={0} mr={1} {...labelProps}>
          {label}
        </FormLabel>
      </Flex>
      {children}
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormItem;
