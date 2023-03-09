import React, { FC, ReactNode } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

interface ModalConfirmProps {
  onConfirm: () => void;
  header?: string;
  overlay?: boolean;
  hasCloseBtn?: boolean;
  confirmText: string;
  cancelText?: string;
  confirmLoading?: boolean;
  confirmScheme?: string;
  isOpen: boolean;
  onClose: () => void;
  modalProps?: any;
  headerProps?: any;
  title?: string;
  message: string | ReactNode;
}

const ModalConfirm: FC<ModalConfirmProps> = ({
  onConfirm,
  header,
  overlay = true,
  hasCloseBtn = true,
  confirmText,
  cancelText,
  confirmLoading,
  confirmScheme = "primary",
  isOpen,
  onClose,
  modalProps,
  headerProps,
  title,
  message,
}) => {
  return (
    <Modal
      size="3xl"
      {...modalProps}
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      {overlay ? <ModalOverlay /> : null}
      <ModalContent>
        {header ? (
          <ModalHeader mb={2} {...headerProps} borderRadius="6px 6px 0 0;">
            {header}
          </ModalHeader>
        ) : null}
        {hasCloseBtn ? <ModalCloseButton /> : null}
        <Box p={4} mb={4}>
          <Heading as="h4" fontSize="16px" mb={2}>
            {title}
          </Heading>
          <Text>{message}</Text>
        </Box>
        <ModalFooter>
          <ButtonGroup>
            {cancelText ? (
              <Button
                onClick={() => {
                  onClose();
                }}
                variant="light"
              >
                {cancelText}
              </Button>
            ) : null}
            <Button
              colorScheme={confirmScheme}
              isLoading={confirmLoading}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirm;
