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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios, { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { deleteAlbum, saveAlbum } from "../api/albums";
import AlbumCard from "../components/AlbumCard";
import { Album, User } from "../helpers/types";

interface AlbumsViewProps {
  user: User;
}

const AlbumsView = ({ user }: AlbumsViewProps) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`/api/albums`);
        setAlbums(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(`Couldn't retrieve albums: ${error}`);
        setError(error);
        return false;
      }
    };
    fetchAlbums();
  }, []);

  const validate = (values: Album) => {
    const errors = {} as any;

    if (!values.title) errors.title = "Required";

    if (!values.link_url) errors.link_url = "Required";

    if (!values.date) errors.date = "Required";

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: undefined as number | undefined,
      title: "",
      description: "",
      link_url: "",
      thumbnail_url: "",
      date: new Date().toISOString().split("T")[0],
    },
    validate,
    onSubmit: (values) => {
      const albumValues = { ...values, id: values.id || 0 }; //double-check this
      handleSubmit(albumValues);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (currentAlbum) {
      formik.setValues({
        id: currentAlbum.id ?? undefined,
        title: currentAlbum.title,
        description: currentAlbum.description,
        link_url: currentAlbum.link_url,
        thumbnail_url: currentAlbum.thumbnail_url,
        date: currentAlbum.date,
      });
    } else {
      formik.resetForm();
    }
  }, [currentAlbum]);

  const renderAlbum = (album: Album) => {
    return (
      <AlbumCard
        key={album.id}
        user={user}
        album={album}
        onOpen={onOpen}
        setCurrentAlbum={setCurrentAlbum}
      />
    );
  };

  const handleSubmit = async (values: Album) => {
    try {
      const savedAlbum: Album = await saveAlbum(values);
      if (currentAlbum) {
        setAlbums(
          albums.map((album) =>
            album.id === savedAlbum.id ? savedAlbum : album
          )
        );
        toast({
          title: "Album Updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setAlbums([savedAlbum, ...albums]);
        toast({
          title: "New Album Created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setCurrentAlbum(null);
      formik.resetForm();
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Check console log for details.";

      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error saving album:", error);
      toast({
        title: "Error saving album:",
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

  const renderAlert = (error: string) => {
    return (
      <Text color="red" fontSize="12px">
        {error}
      </Text>
    );
  };

  const renderHeading = () => {
    return (
      <Heading fontFamily={"Comic Sans MS"} size="lg" mb={4}>
        FOTO ALBUMS
      </Heading>
    );
  };

  if (loading) {
    return (
      <Flex direction="column" width="100%">
        {renderHeading()}
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" width="100%">
        {renderHeading()}
        <Text>Error: {JSON.stringify(error)}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%">
      {renderHeading()}
      <Flex>
        <Button
          leftIcon={<FaPlus />}
          borderRadius="25px"
          colorScheme="green"
          variant="outline"
          onClick={() => {
            setCurrentAlbum(null);
            onOpen();
          }}
        >
          New Album
        </Button>
      </Flex>
      <Flex direction="column">
        {albums &&
          albums.length > 0 &&
          albums.map((album) => renderAlbum(album))}
      </Flex>
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
                <Button colorScheme="green" borderRadius="25px" type="submit">
                  {currentAlbum ? "Save Changes" : "Create Album"}
                </Button>
                {currentAlbum && (
                  <Button
                    colorScheme="red"
                    borderRadius="25px"
                    leftIcon={<FaRegTrashAlt />}
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
    </Flex>
  );
};

export default AlbumsView;
