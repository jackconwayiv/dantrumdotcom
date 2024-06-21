import { Box, Flex, Image, useBoolean } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const images = ["utah.jpg", "skyline.jpg", "safari.jpg", "cafe.jpg"];

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDots, setShowDots] = useBoolean(false);
  const totalImages = images.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  return (
    <Box
      position="relative"
      width="100%"
      maxWidth="500px"
      height="375px" // Fixed height for all images
      mx="auto"
      overflow="hidden"
      onMouseEnter={setShowDots.on}
      onMouseLeave={setShowDots.off}
    >
      <Image
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        width="100%"
        height="100%"
        objectFit="cover" // Ensures image maintains aspect ratio and covers the entire area
        borderRadius="md"
        cursor="pointer"
        border="1px black solid"
        onClick={nextSlide}
      />
      <Flex
        position="absolute"
        bottom="10px"
        width="100%"
        justifyContent="center"
        display={showDots ? "flex" : "none"}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            width={currentIndex === index ? "12px" : "8px"}
            height={currentIndex === index ? "12px" : "8px"}
            borderRadius="50%"
            bg={currentIndex === index ? "whiteAlpha.800" : "whiteAlpha.500"}
            margin="0 4px"
            transition="all 0.3s"
          />
        ))}
      </Flex>
    </Box>
  );
};

export default ImageCarousel;
