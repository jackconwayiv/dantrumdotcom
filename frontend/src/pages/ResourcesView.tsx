import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios, { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaWrench } from "react-icons/fa";
import { deleteResource, saveResource } from "../api/resources";
import { Resource, User } from "../helpers/types";
import { isOwner } from "../helpers/utils";

interface ResourcesViewProps {
  user: User;
}

export default function ResourcesView({ user }: ResourcesViewProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef(null);

  const validate = (values: Resource) => {
    const errors = {} as any;

    if (!values.title) errors.title = "Required";

    if (!values.url) errors.link_url = "Required";

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: undefined as number | undefined,
      title: "",
      description: "",
      url: "",
      thumbnail_url: "",
    },
    validate,
    onSubmit: (values) => {
      const resourceValues = { ...values, id: values.id || 0 }; //double-check this
      handleSubmit(resourceValues);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (currentResource) {
      formik.setValues({
        id: currentResource.id ?? undefined,
        title: currentResource.title,
        description: currentResource.description,
        url: currentResource.url,
        thumbnail_url: currentResource.thumbnail_url,
      });
    } else {
      formik.resetForm();
    }
  }, [currentResource]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`/api/resources`);
        setResources(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(`Couldn't retrieve resources: ${error}`);
        setError(error);
        return false;
      }
    };
    fetchResources();
  }, []);

  const renderResource = (resource: Resource) => {
    return (
      <Card
        direction={{ base: "column", sm: "row" }}
        width="375px"
        height="125px"
        overflow="hidden"
        key={resource.id}
      >
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          {resource.thumbnail_url && (
            <Image
              minW="150px"
              maxW={{ base: "100%", sm: "150px" }}
              height="100px"
              objectFit="cover"
              cursor="pointer"
              src={resource.thumbnail_url}
              alt={resource.title}
            />
          )}
        </a>
        <Flex direction="column" p={2}>
          <Flex justifyContent="space-between" width="100%">
            <Text fontSize="12">{resource.title.toUpperCase()}</Text>{" "}
            {isOwner(user, resource) ? (
              <FaWrench
                cursor="pointer"
                onClick={() => {
                  setCurrentResource(resource);
                  // onOpen();
                }}
              />
            ) : (
              <></>
            )}
          </Flex>
          <Flex width="100%">
            <Text fontSize="10">{resource.description}</Text>
          </Flex>
        </Flex>
      </Card>
    );
  };

  const handleSubmit = async (values: Resource) => {
    try {
      const savedResource: Resource = await saveResource(values);
      if (currentResource) {
        setResources(
          resources.map((resource) =>
            resource.id === savedResource.id ? savedResource : resource
          )
        );
        toast({
          title: "Resource Updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setResources([savedResource, ...resources]);
        toast({
          title: "New Resource Created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setCurrentResource(null);
      formik.resetForm();
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Check console log for details.";

      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error saving resource:", error);
      toast({
        title: "Error saving resource:",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleDelete = async () => {
    //this sets currentAlbum earlier due to Alert Dialog popup
    try {
      await deleteResource(currentResource!.id || 0);
      setResources(
        resources.filter((resource) => resource.id !== currentResource!.id)
      );
      toast({
        title: "Resource Deleted",
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
      console.error("Error deleting resource:", error);
      toast({
        title: "Error deleting resource:",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const renderAlert = (error: string) => {
    return (
      <Text color="red" fontSize="12px">
        {error}
      </Text>
    );
  };

  if (loading) {
    return (
      <Flex direction="column" width="100%">
        <Heading>RESOURCES</Heading>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" width="100%">
        <Heading>RESOURCES</Heading>
        <Text>Error: {JSON.stringify(error)}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%">
      <Heading>RESOURCES</Heading>
      <Button
        width="120px"
        m={4}
        onClick={() => {
          setCurrentResource(null);
          onOpen();
        }}
      >
        Add Resource
      </Button>
      <Wrap>
        {resources &&
          resources.length > 0 &&
          resources.map((resource) => renderResource(resource))}
      </Wrap>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentResource ? "Edit Resource" : "Create Resource"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <Flex direction="column" m={3}>
                <label htmlFor="title">Title:</label>
                <Input
                  type="text"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title
                  ? renderAlert(formik.errors.title)
                  : null}
              </Flex>
              <Flex direction="column" m={3}>
                <label htmlFor="description">Description:</label>
                <Input
                  type="text"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description
                  ? renderAlert(formik.errors.description)
                  : null}
              </Flex>
              <Flex direction="column" m={3}>
                <label htmlFor="url">Resource URL link:</label>
                <Input
                  type="url"
                  name="url"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.url && formik.errors.url
                  ? renderAlert(formik.errors.url)
                  : null}
              </Flex>
              <Flex direction="column" m={3}>
                <label htmlFor="thumbnail_url">Thumbnail URL:</label>
                <Input
                  type="url"
                  name="thumbnail_url"
                  value={formik.values.thumbnail_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.thumbnail_url && formik.errors.thumbnail_url
                  ? renderAlert(formik.errors.thumbnail_url)
                  : null}
              </Flex>
              <Flex marginY={6} justifyContent="space-evenly">
                <Button
                  onClick={() => {
                    !currentResource && formik.resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button colorScheme="green" type="submit">
                  {currentResource ? "Save Changes" : "Create Resource"}
                </Button>
                {currentResource && (
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
              Delete Resource: {currentResource && currentResource.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you truly wish to deprive your friends of this precious
              resource? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setCurrentResource(null);
                  onAlertClose();
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete();
                  setCurrentResource(null);
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
