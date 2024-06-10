import { Card, Flex, Heading, Image, Text, Wrap } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AlbumType } from "../helpers/types";

const Albums = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  const navigate = useNavigate();

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
      <Wrap>
        {albums &&
          albums.length > 0 &&
          albums.map((album) => (
            <Card
              key={album.id}
              direction={{ base: "column", sm: "row" }}
              width="375px"
              height="125px"
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
      </Wrap>
    </Flex>
  );
};

export default Albums;
