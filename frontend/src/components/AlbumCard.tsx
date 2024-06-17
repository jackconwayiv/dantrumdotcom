import { Box, Card, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { FaGear } from "react-icons/fa6";
import { Album, User } from "../helpers/types";
import { isOwner } from "../helpers/utils";

interface AlbumCardProps {
  user: User;
  album: Album;
  onOpen: any;
  setCurrentAlbum: any;
}

const AlbumCard = ({
  user,
  album,
  onOpen,
  setCurrentAlbum,
}: AlbumCardProps) => {
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      margin={3}
      padding={2}
      key={album.id}
    >
      <a
        href={album.link_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Flex direction={{ base: "column", sm: "row" }}>
          <Box
            width={{ base: "100%", sm: "250px" }}
            height={{ base: "auto", sm: "200px" }}
            overflow="hidden"
            flexShrink={0}
          >
            <Image
              width="100%"
              height="100%"
              maxHeight={{ base: "200px", sm: "200px" }}
              objectFit="cover"
              cursor="pointer"
              border="1px silver solid"
              src={album.thumbnail_url}
              alt={album.title}
            />
          </Box>
          <Box ml={{ base: 0, sm: 4 }} mt={{ base: 4, sm: 0 }}>
            <Flex direction="column" p={4}>
              <Flex justifyContent="space-between">
                <Text mb={4} fontFamily={"Comic Sans MS"} fontWeight="bold">
                  {album.date} {album.title.toUpperCase()}
                </Text>
              </Flex>
              <Flex width="100%">
                <Text fontFamily={"Comic Sans MS"}>{album.description}</Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </a>
      <Spacer />
      <Flex justifyContent="end">
        {isOwner(user, album) ? (
          <FaGear
            cursor="pointer"
            size="25px"
            onClick={() => {
              setCurrentAlbum(album);
              onOpen();
            }}
          />
        ) : (
          <></>
        )}
      </Flex>
    </Card>
  );
};

export default AlbumCard;
