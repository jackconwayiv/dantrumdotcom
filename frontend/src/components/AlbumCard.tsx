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
    <Card direction="column" padding={1} height="100%" width="100%">
      <Flex direction="column" height="100%">
        <a
          href={album.link_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <Box width="100%" height="160px" overflow="hidden" flexShrink={0}>
            <Image
              width="100%"
              height="100%"
              maxHeight="160px"
              objectFit="cover"
              border="1px solid"
              borderColor="oasis.gray"
              src={album.thumbnail_url || "/placeholder.jpg"}
              alt={album.title}
            />
          </Box>
        </a>
        <Box mt={3} flex="1">
          <Flex direction="column">
            <a
              href={album.link_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <Heading fontWeight="bold" size="md" p={1}>
                {album.title.toUpperCase()}
              </Heading>
              <Text p={1} color="oasis.text">
                {album.description}
              </Text>
            </a>
            <Spacer />
            <Flex justifyContent="space-between" alignItems="center">
              <Flex
                cursor="pointer"
                onClick={() => {
                  if (album.owner) navigate(`/app/friends/${album.owner.id}`);
                }}
              >
                {album.owner && renderSharedBy(album.owner)}
              </Flex>
              {!album.title.toUpperCase().includes("RANDOM") && (
                <Text fontSize="xs" color="gray.600">
                  {renderAlbumDate(album.date)}
                </Text>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Spacer />
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
        ) : null}
      </Flex>
    </Card>
  );
};

export default AlbumCard;
