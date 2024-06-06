import { Card, Flex, Grid, Heading, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Album {
  id: number;
  title: string;
  description: string;
  link_url: string;
  thumbnail_url: string;
  date: string;
  owner: number;
}

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/albums/");
        setAlbums(response.data.results);
        setLoading(false);
      } catch (err: unknown) {
        let errorMessage;
        if (axios.isAxiosError(err)) {
          errorMessage =
            err?.response?.statusText || "An unknown error occurred";
        } else {
          errorMessage = "An unknown error occurred";
        }
        console.error("There was an error fetching the albums: ", err);
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <Flex direction="column">
        <Heading>PHOTOS</Heading>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column">
        <Heading>PHOTOS</Heading>
        <Text>Error: {error}</Text>
      </Flex>
    );
  }
  return (
    <Flex direction="column" alignItems="center" p={4} width="100%">
      <Heading mb={4}>Albums</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
        {albums &&
          albums.length > 0 &&
          albums.map((album) => (
            <Card
              key={album.id}
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              cursor="pointer"
              onClick={() => navigate(album.link_url)}
            >
              <Image
                minW="150px"
                maxW={{ base: "100%", sm: "150px" }}
                height="100px"
                objectFit="cover"
                src={album.thumbnail_url}
                alt={album.title}
              />
              <Flex direction="column" p={2}>
                <Text fontSize="12">{album.title.toUpperCase()}</Text>
                <Text fontSize="10">{album.description}</Text>
                <Text fontSize="10">{album.date}</Text>
              </Flex>
            </Card>
          ))}
      </Grid>
    </Flex>
  );
};

export default Albums;
