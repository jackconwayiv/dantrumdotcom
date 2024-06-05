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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <Flex direction="column" p={4} width="100%">
      <Heading mb={4}>Albums</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
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
                maxW={{ base: "100%", sm: "200px" }}
                height="100px"
                objectFit="cover"
                src={album.thumbnail_url}
                alt={album.title}
              />
              <Flex direction="column" p={2}>
                <Heading size="sm">{album.title}</Heading>
                <Text>{album.description}</Text>
                <Text>{album.date}</Text>
              </Flex>
            </Card>
          ))}
      </Grid>
    </Flex>
  );
};

export default Albums;
