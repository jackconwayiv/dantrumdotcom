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
import React, { useEffect, useRef, useState } from "react";
import { FaWrench } from "react-icons/fa";
import { deleteAlbum, saveAlbum } from "../api/albums";
import { Album, User } from "../helpers/types";
import { isOwner } from "../helpers/utils";

interface AlbumsViewProps {
  user: User;
}

const AlbumsView: React.FC<AlbumsViewProps> = ({ user }) => {
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

    if (!values.description) errors.description = "Required";

    if (!values.link_url) errors.link_url = "Required";

    if (!values.thumbnail_url) errors.thumbnail_url = "Required";

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

  if (loading) {
    return (
      <Flex direction="column">
        <Heading mb={4}>PHOTOS</Heading>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column">
        <Heading mb={4}>PHOTOS</Heading>
        <Text>Error: {JSON.stringify(error)}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%">
      <Heading mb={4}>PHOTOS</Heading>
      <Button
        width="120px"
        m={4}
        onClick={() => {
          setCurrentAlbum(null);
          onOpen();
        }}
      >
        Add Album
      </Button>
      <Wrap>
        {albums &&
          albums.length > 0 &&
          albums.map((album) => (
            <Card
              direction={{ base: "column", sm: "row" }}
              width="375px"
              height="125px"
              overflow="hidden"
              key={album.id}
            >
              <a
                href={album.link_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Image
                  minW="150px"
                  maxW={{ base: "100%", sm: "150px" }}
                  height="100px"
                  objectFit="cover"
                  cursor="pointer"
                  src={album.thumbnail_url}
                  alt={album.title}
                />
              </a>
              <Flex direction="column" p={2}>
                <Flex justifyContent="space-between" width="100%">
                  <Text fontSize="12">{album.title.toUpperCase()}</Text>{" "}
                  {isOwner(user, album) ? (
                    <FaWrench
                      cursor="pointer"
                      onClick={() => {
                        setCurrentAlbum(album);
                        onOpen();
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </Flex>
                <Flex width="100%">
                  <Text fontSize="10">{album.description}</Text>
                </Flex>
                <Flex justifyContent="space-between" width="100%">
                  <Text fontSize="10">{album.date}</Text>
                </Flex>
              </Flex>
            </Card>
          ))}
      </Wrap>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentAlbum ? "Edit Album" : "Create Album"}
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
                  onClick={() => {
                    !currentAlbum && formik.resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button colorScheme="green" type="submit">
                  {currentAlbum ? "Save Changes" : "Create Album"}
                </Button>
                {currentAlbum && (
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
