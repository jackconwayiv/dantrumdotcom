import {
  Box,
  Card,
  Flex,
  Heading,
  Image,
  Spacer,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Album, User } from "../helpers/types";
import { isOwner, renderAlbumDate, renderSharedBy } from "../helpers/utils";

interface AlbumCardProps {
  user: User;
  album: Album;
  onOpen: () => void;
  setCurrentAlbum: React.Dispatch<React.SetStateAction<Album | null>>;
}

const AlbumCard = ({
  user,
  album,
  onOpen,
  setCurrentAlbum,
}: AlbumCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      padding={1}
      margin={2}
      key={album.id}
      width="95%"
    >
      <Flex direction={{ base: "column", sm: "row" }} width="100%">
        <a
          href={album.link_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
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
              border="1px silver solid"
              src={album.thumbnail_url || "/placeholder.jpg"}
              alt={album.title}
            />
          </Box>
        </a>
        <Box ml={{ base: 0, sm: 4 }} mt={{ base: 4, sm: 0 }} width="100%">
          <Flex direction="column" width="100%">
            <a
              href={album.link_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <Flex direction="row" width="100%" justifyContent="space-between">
                <Flex justifyContent="space-between">
                  <Heading
                    fontFamily={"Comic Sans MS"}
                    fontWeight="bold"
                    size="md"
                    p={1}
                  >
                    {album.title.toUpperCase()}
                  </Heading>
                </Flex>
                <Flex justifyContent="end">
                  {isOwner(user, album) ? (
                    <Tooltip
                      label={`Edit ${album.title}`}
                      placement="top"
                      fontSize="md"
                    >
                      <Box>
                        <FaGear
                          cursor="pointer"
                          size="25px"
                          onClick={() => {
                            setCurrentAlbum(album);
                            onOpen();
                          }}
                        />
                      </Box>
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </Flex>
              </Flex>
              <Flex>
                <Text p={1} fontFamily={"Comic Sans MS"}>
                  {album.description}
                </Text>
              </Flex>
            </a>
            <Spacer />
            <Flex direction="row" justifyContent="space-between">
              <Flex
                cursor="pointer"
                onClick={() => {
                  if (album.owner) navigate(`/app/friends/${album.owner.id}`);
                }}
              >
                {album.owner && renderSharedBy(album.owner)}
              </Flex>
              {!album.title.toUpperCase().includes("RANDOM") && (
                <Text p={1} fontSize="10px" fontFamily={"Comic Sans MS"}>
                  {renderAlbumDate(album.date)}
                </Text>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Spacer />
    </Card>
  );
};

export default AlbumCard;
