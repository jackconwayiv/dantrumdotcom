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
      direction="column"
      padding={1}
      height="100%"
      width="100%"
    >
      <Flex direction="column" height="100%">
        <a
          href={resource.url}
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
              src={resource.thumbnail_url || "/placeholder.jpg"}
              alt={resource.title}
            />
          </Box>
        </a>
        <Box mt={3} flex="1">
          <Flex direction="column">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <Flex justifyContent="space-between">
                <Heading
                  fontWeight="bold"
                  size="md"
                  p={1}
                >
                  {resource.title.toUpperCase()}
                </Heading>
              </Flex>
              <Flex>
                <Text p={1} color="oasis.text">
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
