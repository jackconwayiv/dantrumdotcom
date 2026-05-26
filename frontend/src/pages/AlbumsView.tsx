import { Flex, SimpleGrid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import AppButton from "../components/ui/AppButton";
import PageHeading from "../components/ui/PageHeading";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  fetchAlbumYears,
  fetchAlbumsForYear,
  fetchMyAlbums,
  saveAlbum,
} from "../api/albums";
import AlbumCard from "../components/AlbumCard";
import { AlbumModals } from "../components/AlbumModals";
import YearSelector from "../components/YearSelector";
import { defaultAlbumYear } from "../components/defaultAlbumYear";
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
    const loadYears = async () => {
      try {
        const availableYears = await fetchAlbumYears();
        if (!availableYears) {
          setLoading(false);
          return;
        }
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
    loadYears();
  }, []);

  const fetchAlbums = useCallback(async () => {
    if (selectedYear === undefined) return;

    setLoading(true);
    setError(null);

    try {
      const data =
        selectedYear === "mine"
          ? await fetchMyAlbums()
          : await fetchAlbumsForYear(Number(selectedYear));
      setAlbums(data ?? []);
    } catch (err) {
      console.error("Couldn't retrieve albums:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear !== undefined) {
      fetchAlbums();
    }
  }, [selectedYear, fetchAlbums]);

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
  }, [currentAlbum, formik]);

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
    const savedAlbum = await saveAlbum(values);
    if (savedAlbum) {
      const albumDate = new Date(savedAlbum.date);
      const timelineHint = !currentAlbum
        ? ` It will show on the Timeline for ${albumDate.toLocaleString("default", { month: "long" })} ${albumDate.getFullYear()}.`
        : "";
      toast({
        title: currentAlbum ? "Album Updated!" : "New Album Created!",
        description: `Thanks for sharing.${timelineHint}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setCurrentAlbum(null);
      formik.resetForm();
      onClose();

      const albumYear = new Date(savedAlbum.date).getFullYear();
      if (!currentAlbum && !years.includes(albumYear)) {
        const updatedYears = await fetchAlbumYears();
        if (updatedYears) {
          setYears(updatedYears);
        }
      }

      if (currentAlbum) {
        setAlbums((prev) =>
          prev.map((album) => (album.id === savedAlbum.id ? savedAlbum : album))
        );
      } else if (
        selectedYear === "mine" ||
        selectedYear === albumYear
      ) {
        setAlbums((prev) => [savedAlbum, ...prev]);
      }
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

  const renderHeading = () => <PageHeading>FOTO ALBUMS</PageHeading>;

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
        <AppButton
          leftIcon={<FaPlus />}
          colorTone="success"
          onClick={() => {
            setCurrentAlbum(null);
            onOpen();
          }}
        >
          New Album
        </AppButton>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={4}
        width="100%"
        mt={2}
      >
        {albums.map((album) => renderAlbum(album))}
      </SimpleGrid>
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
