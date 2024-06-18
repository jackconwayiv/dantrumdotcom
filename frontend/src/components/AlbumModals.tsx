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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useRef } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteAlbum } from "../api/albums";
import { Album } from "../helpers/types";

interface AlbumModalsProps {
  albums: Album[];
  isOpen: boolean;
  onClose: () => void;
  currentAlbum: Album | null;
  setCurrentAlbum: React.Dispatch<React.SetStateAction<Album | null>>;
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  formik: any;
}

export const AlbumModals = ({
  albums,
  isOpen,
  onClose,
  currentAlbum,
  setCurrentAlbum,
  setAlbums,
  formik,
}: AlbumModalsProps) => {
  const toast = useToast();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef(null);

  const renderAlert = (error: string) => {
    return (
      <Text color="red" fontSize="12px">
        {error}
      </Text>
    );
  };

  const handleDelete = async () => {
    //this sets currentAlbum earlier due to Alert Dialog popup
    try {
      await deleteAlbum(currentAlbum!.id || 0);
      setAlbums(albums.filter((album) => album.id !== currentAlbum!.id));
      toast({
        title: "Album Deleted",
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
      console.error("Error deleting album:", error);
      toast({
        title: "Error deleting album:",
        description: errorMessage,
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
          <ModalHeader>
            {currentAlbum ? "Edit Foto Album:" : "New Foto Album:"}
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
                <label htmlFor="link_url">Album URL link:</label>
                <Input
                  type="url"
                  name="link_url"
                  value={formik.values.link_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.link_url && formik.errors.link_url
                  ? renderAlert(formik.errors.link_url)
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
              <Flex direction="column" m={3}>
                <label htmlFor="date">Album Date:</label>
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
                  borderRadius="25px"
                  colorScheme="gray"
                  variant="outline"
                  onClick={() => {
                    !currentAlbum && formik.resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                {currentAlbum && (
                  <Button
                    colorScheme="red"
                    borderRadius="25px"
                    onClick={() => {
                      onClose();
                      onAlertOpen();
                    }}
                  >
                    <FaRegTrashAlt />
                  </Button>
                )}
                <Button colorScheme="green" borderRadius="25px" type="submit">
                  {currentAlbum ? "Save Changes" : "Create Album"}
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
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Album: {currentAlbum && currentAlbum.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setCurrentAlbum(null);
                  onAlertClose();
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete();
                  setCurrentAlbum(null);
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
