import { Card, CardHeader, Flex, Heading, Text } from "@chakra-ui/react";

interface Album {
  id: number;
  title: string;
  description: string;
  link_url: string;
  thumbnail_url: string;
  date: string;
  owner: number;
}

const sampleAlbums: Album[] = [
  {
    id: 1,
    title: "Test Album",
    description: "An album for testing",
    link_url: "hi",
    thumbnail_url: "hi2",
    date: "YYYY-MM-DD",
    owner: 1,
  },
];

const Albums = () => {
  return (
    <Flex direction="column">
      <Heading>Albums</Heading>

      {sampleAlbums.map((album) => (
        <Card key={album.id}>
          <CardHeader>
            <Heading size="sm">{album.title}</Heading>
          </CardHeader>
          <Text>{album.description}</Text>
          <Text>{album.date}</Text>
        </Card>
      ))}
    </Flex>
  );
};

export default Albums;
