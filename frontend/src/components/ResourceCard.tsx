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
import { Resource, User } from "../helpers/types";
import { isOwner } from "../helpers/utils";

interface AlbumCardProps {
  user: User;
  resource: Resource;
  onOpen: () => void;
  setCurrentResource: React.Dispatch<React.SetStateAction<Resource | null>>;
}

const AlbumCard = ({
  user,
  resource,
  onOpen,
  setCurrentResource,
}: AlbumCardProps) => {
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      padding={2}
      margin={4}
      key={resource.id}
      width="95%"
    >
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", cursor: "alias" }}
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
              border="1px silver solid"
              src={resource.thumbnail_url}
              alt={resource.title}
            />
          </Box>
          <Box ml={{ base: 0, sm: 4 }} mt={{ base: 4, sm: 0 }}>
            <Flex direction="column">
              <Flex justifyContent="space-between">
                <Heading
                  fontFamily={"Comic Sans MS"}
                  fontWeight="bold"
                  size="md"
                  p={1}
                >
                  {resource.title.toUpperCase()}
                </Heading>
              </Flex>
              <Flex>
                <Text p={1} fontFamily={"Comic Sans MS"}>
                  {resource.description}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </a>
      <Spacer />
      <Flex justifyContent="end">
        {isOwner(user, resource) ? (
          <Tooltip
            label={`Edit ${resource.title}`}
            placement="top"
            fontSize="md"
          >
            <Box>
              <FaGear
                cursor="context-menu"
                size="25px"
                onClick={() => {
                  setCurrentResource(resource);
                  onOpen();
                }}
              />
            </Box>
          </Tooltip>
        ) : (
          <></>
        )}
      </Flex>
    </Card>
  );
};

export default AlbumCard;
