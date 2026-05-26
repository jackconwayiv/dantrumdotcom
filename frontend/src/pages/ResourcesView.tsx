import { Flex, SimpleGrid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import AppButton from "../components/ui/AppButton";
import PageHeading from "../components/ui/PageHeading";
import { FormikErrors, useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { fetchResources, saveResource } from "../api/resources";
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
  }, [currentResource, formik]);

  const loadResources = async () => {
    try {
      const data = await fetchResources();
      if (data) {
        setResources(data);
      } else {
        setError("Couldn't retrieve resources");
      }
    } catch {
      setError("Couldn't retrieve resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (values: Resource) => {
    const savedResource = await saveResource(values);
    if (savedResource) {
      toast({
        title: currentResource ? "Resource Updated!" : "New Resource Created!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setCurrentResource(null);
      formik.resetForm();
      onClose();
      if (currentResource) {
        setResources((prev) =>
          prev.map((resource) =>
            resource.id === savedResource.id ? savedResource : resource
          )
        );
      } else {
        setResources((prev) => [savedResource, ...prev]);
      }
    } else {
      console.error("Error saving resource:", error);
      toast({
        title: "Error!",
        description: "An error occurred while trying to save this resource.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    }
  };

  const renderHeading = () => <PageHeading>LINKS & RESOURCES</PageHeading>;

  if (loading) {
    return (
      <Flex direction="column" width="100%" p={2}>
        {renderHeading()}
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" width="100%" p={2}>
        {renderHeading()}
        <Text>Error: {error}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%" p={2}>
      {renderHeading()}
      <Flex justifyContent="space-evenly">
        <AppButton
          leftIcon={<FaPlus />}
          colorTone="success"
          onClick={() => {
            setCurrentResource(null);
            onOpen();
          }}
        >
          New Resource
        </AppButton>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={4}
        width="100%"
        mt={2}
      >
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            user={user}
            resource={resource}
            onOpen={onOpen}
            setCurrentResource={setCurrentResource}
          />
        ))}
      </SimpleGrid>
      <ResourceModals
        resources={resources}
        setResources={setResources}
        onClose={onClose}
        fetchResources={loadResources}
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
