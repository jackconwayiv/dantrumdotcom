import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios, { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaWrench } from "react-icons/fa";
import { deleteQuote, saveQuote } from "../api/quotes";
import { Quote, User } from "../helpers/types";
import { isOwner } from "../helpers/utils";

interface QuotesViewProps {
  user: User;
}

export default function QuotesView({ user }: QuotesViewProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(`/api/quotes`);
        setQuotes(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(`Couldn't retrieve quotes: ${error}`);
        setError(error);
        return false;
      }
    };
    fetchQuotes();
  }, []);

  const validate = (values: Quote) => {
    const errors = {} as any;

    if (!values.text) errors.text = "Required";

    if (!values.date) errors.date = "Required";

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: undefined as number | undefined,
      text: "",
      date: new Date().toISOString().split("T")[0],
    },
    validate,
    onSubmit: (values) => {
      const quoteValues = { ...values, id: values.id || 0 }; //double-check this
      handleSubmit(quoteValues);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (currentQuote) {
      formik.setValues({
        id: currentQuote.id ?? undefined,
        text: currentQuote.text,
        date: currentQuote.date,
      });
    } else {
      formik.resetForm();
    }
  }, [currentQuote]);

  const renderAlert = (error: string) => {
    return (
      <Text color="red" fontSize="12px">
        {error}
      </Text>
    );
  };

  const handleSubmit = async (values: Quote) => {
    try {
      const savedQuote: Quote = await saveQuote(values);
      if (currentQuote) {
        setQuotes(
          quotes.map((quote) =>
            quote.id === savedQuote.id ? savedQuote : quote
          )
        );
        toast({
          title: "Quote Updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setQuotes([savedQuote, ...quotes]);
        toast({
          title: "New Quote Created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setCurrentQuote(null);
      formik.resetForm();
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Check console log for details.";

      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error saving quote:", error);
      toast({
        title: "Error saving quote:",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleDelete = async () => {
    //this sets currentQuote earlier due to Alert Dialog popup
    try {
      await deleteQuote(currentQuote!.id || 0);
      setQuotes(quotes.filter((quote) => quote.id !== currentQuote!.id));
      toast({
        title: "Quote Deleted",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = "Check console log for details.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error deleting quote:", error);
      toast({
        title: "Error deleting quote:",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const renderQuote = (quote: Quote) => {
    return (
      <Flex
        m={1}
        p={1}
        border="1px black solid"
        key={quote.id}
        height="200px"
        width="275px"
      >
        <Text fontSize="12px">{quote.text}</Text>
        {isOwner(user, quote) ? (
          <FaWrench
            cursor="pointer"
            onClick={() => {
              setCurrentQuote(quote);
              onOpen();
            }}
          />
        ) : (
          <></>
        )}
      </Flex>
    );
  };

  if (loading) {
    return (
      <Flex direction="column">
        <Heading>QUOTES</Heading>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column">
        <Heading>QUOTES</Heading>
        <Text>Error: {JSON.stringify(error)}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column">
      <Heading>QUOTES</Heading>
      <Button
        width="120px"
        m={4}
        onClick={() => {
          setCurrentQuote(null);
          onOpen();
        }}
      >
        Add Quote
      </Button>
      <Wrap>{quotes && quotes.map((quote) => renderQuote(quote))}</Wrap>
      {currentQuote && JSON.stringify(currentQuote)}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentQuote ? "Edit Quote" : "Create Quote"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <Flex direction="column" m={3}>
                <label htmlFor="title">Text:</label>
                <Textarea
                  name="text"
                  value={formik.values.text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.text && formik.errors.text
                  ? renderAlert(formik.errors.text)
                  : null}
              </Flex>
              <Flex direction="column" m={3}>
                <label htmlFor="date">Date Quoted:</label>
                <Input
                  type="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.date && formik.errors.date
                  ? renderAlert(formik.errors.date)
                  : null}
              </Flex>
              <Flex marginY={6} justifyContent="space-evenly">
                <Button
                  onClick={() => {
                    !currentQuote && formik.resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button colorScheme="green" type="submit">
                  {currentQuote ? "Save Changes" : "Create Quote"}
                </Button>
                {currentQuote && (
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      onClose();
                      onAlertOpen();
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Quote
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure the world can live without these wise words:{" "}
              {currentQuote && currentQuote.text}? You can't undo this action
              afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setCurrentQuote(null);
                  onAlertClose();
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete();
                  setCurrentQuote(null);
                  onAlertClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
