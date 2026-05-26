import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
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
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaWrench } from "react-icons/fa";
import { deleteQuote, fetchQuotes, saveQuote } from "../api/quotes";
import AppButton from "../components/ui/AppButton";
import PageHeading from "../components/ui/PageHeading";
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
    const loadQuotes = async () => {
      try {
        const data = await fetchQuotes();
        if (data) {
          setQuotes(data);
        } else {
          setError("Couldn't retrieve quotes");
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadQuotes();
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
  });

  const { setValues, resetForm } = formik;

  useEffect(() => {
    if (!currentQuote) {
      return;
    }
    setValues({
      id: currentQuote.id ?? undefined,
      text: currentQuote.text,
      date: currentQuote.date,
    });
  }, [currentQuote, setValues]);

  const renderAlert = (error: string) => {
    return (
      <Text color="red" fontSize="12px">
        {error}
      </Text>
    );
  };

  const handleSubmit = async (values: Quote) => {
    const savedQuote: Quote = await saveQuote(values);
    if (savedQuote) {
      if (currentQuote) {
        setQuotes(
          quotes.map((quote) =>
            quote.id === savedQuote.id ? savedQuote : quote
          )
        );
        toast({
          title: "Quote Updated!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setQuotes([savedQuote, ...quotes]);
        toast({
          title: "New Quote Created!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setCurrentQuote(null);
      formik.resetForm();
      onClose();
    } else {
      console.error("Error saving quote:", error);
      toast({
        title: "Error!",
        description: "An error occurred while trying to save this quote.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleDelete = async () => {
    //this sets currentQuote earlier due to Alert Dialog popup
    const deletedQuote = await deleteQuote(currentQuote!.id || 0);
    if (deletedQuote) {
      setQuotes(quotes.filter((quote) => quote.id !== currentQuote!.id));
      toast({
        title: "Quote Deleted!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      console.error("Error deleting quote:", error);
      toast({
        title: "Error!",
        description: "An error occurred while trying to delete this quote.",
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
      <Flex direction="column" width="100%">
        <PageHeading>QUOTES</PageHeading>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" width="100%">
        <PageHeading>QUOTES</PageHeading>
        <Text>Error: {JSON.stringify(error)}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%">
      <PageHeading>QUOTES</PageHeading>
      <Button
        width="120px"
        m={4}
        onClick={() => {
          setCurrentQuote(null);
          resetForm();
          onOpen();
        }}
      >
        Add Quote
      </Button>
      <Wrap>{quotes && quotes.map((quote) => renderQuote(quote))}</Wrap>
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
                <AppButton
                  colorTone="outline"
                  onClick={() => {
                    !currentQuote && formik.resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </AppButton>
                <AppButton colorTone="success" type="submit">
                  {currentQuote ? "Save Changes" : "Create Quote"}
                </AppButton>
                {currentQuote && (
                  <AppButton
                    colorTone="cta"
                    onClick={() => {
                      onClose();
                      onAlertOpen();
                    }}
                  >
                    Delete
                  </AppButton>
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
                variant="outline"
                onClick={() => {
                  setCurrentQuote(null);
                  onAlertClose();
                }}
              >
                Cancel
              </Button>
              <AppButton
                colorTone="cta"
                onClick={() => {
                  handleDelete();
                  setCurrentQuote(null);
                  onAlertClose();
                }}
                ml={3}
              >
                Delete
              </AppButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
