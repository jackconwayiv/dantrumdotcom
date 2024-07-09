import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteResource } from "../api/resources";
import { Resource } from "../helpers/types";

interface ResourceModalsProps {
  resources: Resource[];
  isOpen: boolean;
  fetchResources: () => void;
  onClose: () => void;
  currentResource: Resource | null;
  setCurrentResource: React.Dispatch<React.SetStateAction<Resource | null>>;
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  formik: any;
  validate: (values: Resource) => any;
}

export const ResourceModals = ({
  isOpen,
  onClose,
  currentResource,
  setCurrentResource,
  formik,
  fetchResources,
  validate,
}: ResourceModalsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const renderAlert = (error: string) => {
    return (
      <Text color="red" fontSize="12px">
        {error}
      </Text>
    );
  };

  const handleUrlBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const errors = validate({ ...formik.values, url });

    if (!errors.url) {
      setLoading(true);

      const response = await axios.post("/api/summary/", { url });
      if (response) {
        setLoading(false);
        if (response.data) {
          formik.setValues({
            ...formik.values,
            title: formik.values.title || response.data.title || "",
            description:
              formik.values.description || response.data.summary || "",
            thumbnail_url:
              formik.values.thumbnail_url || response.data.thumbnail || "",
          });
          setError(null);
        }
      } else {
        setLoading(false);
        setError(`Couldn't auto-fetch resource details: ${error}`);
      }
    }
  };

  const handleDelete = async () => {
    const deletedResource = await deleteResource(currentResource!.id || 0);
    if (deletedResource) {
      toast({
        title: "Resource Deleted!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setCurrentResource(null);
      fetchResources();
      onAlertClose();
    } else {
      toast({
        title: "Error!",
        description: "An error occurred while trying to delete this resource.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily={"Comic Sans MS"}>
            {currentResource
              ? `Edit Resource: ${currentResource.title}`
              : "Add New Resource"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <Flex direction="column" m={3}>
                <label htmlFor="url">Resource URL:</label>
                <Input
                  type="url"
                  name="url"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={handleUrlBlur}
                />
                {formik.touched.url && formik.errors.url
                  ? renderAlert(formik.errors.url)
                  : null}
              </Flex>
              {loading && (
                <Flex justifyContent="center" alignItems="center" mt={4}>
                  <Spinner />
                  <Text ml={2}>Fetching details...</Text>
                </Flex>
              )}
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
                <Textarea
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
                {formik.values.thumbnail_url && (
                  <Image src={formik.values.thumbnail_url} />
                )}
              </Flex>
              {error && (
                <Text color="red.500" mt={4}>
                  {error}
                </Text>
              )}
              <Flex marginY={6} justifyContent="space-evenly">
                <Button
                  borderRadius="25px"
                  colorScheme="gray"
                  variant="outline"
                  onClick={() => {
                    !currentResource && formik.resetForm();
                    setError(null);
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                {currentResource && (
                  <Button
                    colorScheme="red"
                    borderRadius="25px"
                    onClick={() => {
                      onClose();
                      setError(null);
                      onAlertOpen();
                    }}
                  >
                    <FaRegTrashAlt />
                  </Button>
                )}
                <Button colorScheme="green" borderRadius="25px" type="submit">
                  {currentResource ? "Save Changes" : "Create Resource"}
                </Button>
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
            <AlertDialogHeader
              fontFamily={"Comic Sans MS"}
              fontSize="lg"
              fontWeight="bold"
            >
              Delete Resource: {currentResource && currentResource.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {currentResource && currentResource.thumbnail_url !== "" && (
                <Image src={currentResource?.thumbnail_url} />
              )}
              Do you truly wish to deprive your friends of this precious
              resource? You can't undo this action.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                borderRadius="25px"
                colorScheme="gray"
                variant="outline"
                onClick={() => {
                  setCurrentResource(null);
                  onAlertClose();
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                borderRadius="25px"
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
    </>
  );
};
