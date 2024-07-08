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
import { Resource, User } from "../helpers/types";
import { isOwner, renderSharedBy } from "../helpers/utils";

interface ResourceCardProps {
  user: User;
  resource: Resource;
  onOpen: () => void;
  setCurrentResource: React.Dispatch<React.SetStateAction<Resource | null>>;
}

const ResourceCard = ({
  user,
  resource,
  onOpen,
  setCurrentResource,
}: ResourceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      padding={1}
      margin={2}
      key={resource.id}
      width="95%"
    >
      <Flex direction={{ base: "column", sm: "row" }}>
        <a
          href={resource.url}
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
              src={resource.thumbnail_url}
              alt={resource.title}
            />
          </Box>
        </a>
        <Box ml={{ base: 0, sm: 4 }} mt={{ base: 4, sm: 0 }}>
          <Flex direction="column">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
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
            </a>
            <Spacer />
            <Flex
              cursor="pointer"
              onClick={() => {
                if (resource.owner)
                  navigate(`/app/friends/${resource.owner.id}`);
              }}
            >
              {resource.owner && renderSharedBy(resource.owner)}
            </Flex>
          </Flex>
        </Box>
      </Flex>
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
                cursor="pointer"
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

export default ResourceCard;
