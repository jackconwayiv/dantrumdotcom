import {
  Button,
  Flex,
  Heading,
  Text,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios, { isAxiosError } from "axios";
import { FormikErrors, useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { saveResource } from "../api/resources";
import ResourceCard from "../components/ResourceCard";
import { ResourceModals } from "../components/ResourceModals";
import { Resource, User } from "../helpers/types";

interface ResourcesViewProps {
  user: User;
}

const ResourcesView: React.FC<ResourcesViewProps> = ({ user }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validate = (values: Resource) => {
    const errors: FormikErrors<Resource> = {};

    if (!values.title) errors.title = "Required";

    if (!values.url) errors.url = "Required";

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: undefined,
      title: "",
      description: "",
      url: "",
      thumbnail_url: "",
    },
    validate,
    onSubmit: (values) => {
      const resourceValues = { ...values, id: values.id || 0 };
      handleSubmit(resourceValues);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (currentResource) {
      formik.setValues({
        id: currentResource.id ?? undefined,
        title: currentResource.title,
        description: currentResource.description,
        url: currentResource.url,
        thumbnail_url: currentResource.thumbnail_url,
      });
    } else {
      formik.resetForm();
    }
  }, [currentResource]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`/api/resources`);
        setResources(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(`Couldn't retrieve resources: ${error}`);
        setError("Couldn't retrieve resources");
        return false;
      }
    };
    fetchResources();
  }, []);

  const handleSubmit = async (values: Resource) => {
    try {
      const savedResource: Resource = await saveResource(values);
      if (currentResource) {
        setResources(
          resources.map((resource) =>
            resource.id === savedResource.id ? savedResource : resource
          )
        );
        toast({
          title: "Resource Updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setResources([savedResource, ...resources]);
        toast({
          title: "New Resource Created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setCurrentResource(null);
      formik.resetForm();
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Check console log for details.";

      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error saving resource:", error);
      toast({
        title: "Error saving resource:",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    }
  };

  const renderHeading = () => {
    return (
      <Heading fontFamily={"Comic Sans MS"} size="lg" mb={4}>
        LINKS & RESOURCES
      </Heading>
    );
  };

  if (loading) {
    return (
      <Flex direction="column" width="100%">
        {renderHeading()}
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" width="100%">
        {renderHeading()}
        <Text>Error: {error}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%">
      {renderHeading()}
      <Flex>
        <Button
          leftIcon={<FaPlus />}
          borderRadius="25px"
          colorScheme="green"
          variant="outline"
          m={4}
          onClick={() => {
            setCurrentResource(null);
            onOpen();
          }}
        >
          New Resource
        </Button>
      </Flex>
      <Wrap>
        {resources &&
          resources.length > 0 &&
          resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              user={user}
              resource={resource}
              onOpen={onOpen}
              setCurrentResource={setCurrentResource}
            />
          ))}
      </Wrap>
      <ResourceModals
        resources={resources}
        setResources={setResources}
        onClose={onClose}
        currentResource={currentResource}
        setCurrentResource={setCurrentResource}
        isOpen={isOpen}
        formik={formik}
        validate={validate}
      />
    </Flex>
  );
};

export default ResourcesView;