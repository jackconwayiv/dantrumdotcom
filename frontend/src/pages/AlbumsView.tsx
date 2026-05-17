import {
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { saveAlbum } from "../api/albums";
import AlbumCard from "../components/AlbumCard";
import { AlbumModals } from "../components/AlbumModals";
import YearSelector, { defaultAlbumYear } from "../components/YearSelector";
import { Album, User } from "../helpers/types";

interface AlbumsViewProps {
  user: User;
}

const AlbumsView = ({ user }: AlbumsViewProps) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | number | undefined>(
    undefined
  );

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get<number[]>("/api/years/");
        const availableYears = response.data;
        setYears(availableYears);
        if (availableYears.length > 0) {
          setSelectedYear(defaultAlbumYear(availableYears));
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Couldn't retrieve album years:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchYears();
  }, []);

  const fetchAlbums = async () => {
    if (selectedYear === undefined) return;

    setLoading(true);
    setError(null);

    try {
      let response;
      if (selectedYear === "mine") {
        response = await axios.get("/api/albums/mine/");
      } else {
        response = await axios.get(`/api/albums/year/${selectedYear}/`);
      }
      setAlbums(response.data);
    } catch (err) {
      console.error("Couldn't retrieve albums:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear !== undefined) {
      fetchAlbums();
    }
  }, [selectedYear]);

  const validate = (values: Album) => {
    const errors = {} as any;

    if (!values.title) errors.title = "Required";
    if (!values.link_url) {
      errors.link_url = "Required";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.link_url)) {
      errors.link_url = "Invalid URL";
    }
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
    const savedAlbums = await saveAlbum(values);
    if (savedAlbums) {
      toast({
        title: currentAlbum ? "Album Updated!" : "New Album Created!",
        description: "Thanks for sharing.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setCurrentAlbum(null);
      formik.resetForm();
      onClose();
      const yearsResponse = await axios.get<number[]>("/api/years/");
      setYears(yearsResponse.data);
      fetchAlbums();
    } else {
      console.error("Error saving album:", error);
      toast({
        title: "Error!",
        description: "An error occurred while trying to save this album.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    }
  };

  const renderHeading = () => {
    return (
      <Heading fontFamily={"Comic Sans MS"} size="lg" mb={4}>
        FOTO ALBUMS
      </Heading>
    );
  };

  if (loading || (years.length > 0 && selectedYear === undefined)) {
    return (
      <Flex direction="column" width="100%" p={2}>
        {renderHeading()}
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (years.length === 0) {
    return (
      <Flex direction="column" width="100%" p={2}>
        {renderHeading()}
        <Text>No albums yet.</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" width="100%" p={2}>
        {renderHeading()}
        <Text>Error: {JSON.stringify(error)}</Text>
      </Flex>
    );
  }

  if (selectedYear === undefined) {
    return (
      <Flex direction="column" width="100%" p={2}>
        {renderHeading()}
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%" p={2}>
      {renderHeading()}
      <Flex justifyContent="space-evenly">
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
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
      <Flex direction="column" alignItems="center">
        {albums &&
          albums.length > 0 &&
          albums.map((album) => renderAlbum(album))}
      </Flex>
      <AlbumModals
        currentAlbum={currentAlbum}
        setCurrentAlbum={setCurrentAlbum}
        isOpen={isOpen}
        onClose={onClose}
        formik={formik}
        validate={validate}
        fetchAlbums={fetchAlbums}
      />
    </Flex>
  );
};

export default AlbumsView;
