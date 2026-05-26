import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaBirthdayCake, FaCamera, FaMapSigns, FaStream } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchHomeRecent } from "../api/home";
import { HomeRecentItem, HomeRecentKind } from "../helpers/types";
import { renderNickname } from "../helpers/utils";

const KIND_LABELS: Record<HomeRecentKind, string> = {
  album: "Photo album",
  resource: "Resource",
  event: "Upcoming event",
  birthday: "Birthday",
};

const formatSlideDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const isInternalLink = (url: string) => url.startsWith("/app/");

const HomeRecentCarousel = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<HomeRecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const data = await fetchHomeRecent();
      setItems(data?.items ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const totalSlides = items.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="200px" width="100%">
        <Spinner color="brand.500" />
      </Flex>
    );
  }

  if (totalSlides === 0) {
    return null;
  }

  const item = items[currentIndex];
  const kindLabel = KIND_LABELS[item.kind];
  const dateLabel =
    item.kind === "birthday"
      ? `Birthday ${formatSlideDate(item.date)}`
      : item.kind === "event"
        ? `Upcoming ${formatSlideDate(item.date)}`
        : `Posted ${formatSlideDate(item.sort_date)}`;

  const KindIcon =
    item.kind === "album"
      ? FaCamera
      : item.kind === "resource"
        ? FaMapSigns
        : item.kind === "birthday"
          ? FaBirthdayCake
          : FaStream;

  const badgeScheme =
    item.kind === "birthday"
      ? "orange"
      : item.kind === "event"
        ? "brand"
        : item.kind === "resource"
          ? "orange"
          : "brand";

  const handleClick = () => {
    if (isInternalLink(item.link_url)) {
      navigate(item.link_url);
    } else {
      window.open(item.link_url, "_blank", "noopener,noreferrer");
    }
  };

  const showImage =
    item.kind === "album" ||
    item.kind === "resource" ||
    (item.kind === "birthday" && item.thumbnail_url);

  return (
    <Box
      position="relative"
      width="95%"
      maxWidth={{ base: "95%", sm: "400px", md: "500px" }}
      height={{ base: "220px", sm: "300px", md: "340px" }}
      mx="auto"
      my={4}
    >
      <Box
        display="block"
        height="100%"
        borderRadius="2xl"
        border="1px solid"
        borderColor="oasis.gray"
        overflow="hidden"
        bg={item.kind === "birthday" ? "oasis.orange.100" : "oasis.surface"}
        boxShadow="card"
        cursor="pointer"
        onClick={handleClick}
      >
        {showImage ? (
          item.kind === "birthday" ? (
            <Flex justify="center" align="center" height="55%" bg="oasis.orange.50">
              <Avatar
                size="xl"
                src={item.thumbnail_url}
                name={item.title}
              />
            </Flex>
          ) : (
            <Image
              src={item.thumbnail_url || "/placeholder.jpg"}
              alt={item.title}
              width="100%"
              height="55%"
              objectFit="cover"
            />
          )
        ) : (
          <Flex
            justify="center"
            align="center"
            height="55%"
            bg="brand.50"
          >
            <KindIcon size={48} color="var(--purple)" />
          </Flex>
        )}
        <Box p={4} height="45%">
          <Flex align="center" gap={2} mb={2}>
            <KindIcon size={18} color="var(--purple)" />
            <Badge colorScheme={badgeScheme} borderRadius="full" px={2}>
              {kindLabel}
            </Badge>
          </Flex>
          <Heading size="sm" color="brand.600" noOfLines={1}>
            {item.kind === "birthday" ? `🎂 ${item.title}` : item.title}
          </Heading>
          <Text fontSize="xs" color="gray.600" mt={1}>
            {dateLabel}
          </Text>
          {item.description ? (
            <Text fontSize="sm" color="gray.600" noOfLines={2} mt={1}>
              {item.description}
            </Text>
          ) : null}
          {item.owner ? (
            <Text fontSize="xs" color="gray.500" mt={2}>
              {item.kind === "birthday"
                ? renderNickname(item.owner)
                : `Shared by ${renderNickname(item.owner)}`}
            </Text>
          ) : null}
        </Box>
      </Box>

      {totalSlides > 1 && totalSlides <= 12 ? (
        <Flex
          position="absolute"
          bottom="10px"
          width="100%"
          justifyContent="center"
        >
          {items.map((_, index) => (
            <Box
              key={index}
              width={currentIndex === index ? "12px" : "8px"}
              height={currentIndex === index ? "12px" : "8px"}
              borderRadius="50%"
              bg={currentIndex === index ? "brand.500" : "brand.200"}
              margin="0 4px"
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </Flex>
      ) : null}
    </Box>
  );
};

export default HomeRecentCarousel;
