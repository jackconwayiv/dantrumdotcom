import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaFlask, FaUserPlus } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import {
  addMember,
  createSelf,
  deleteFamilyMember,
  editFamilyMember,
  getFamilyMembersByOwner,
  getRelationsById,
} from "../api/familyTree";
import {
  AddMemberData,
  FamilyTreeMember,
  FamilyTreeRelation,
  User,
} from "../helpers/types";
import { renderShortBirthday } from "../helpers/utils";

interface FamilyTreeProps {
  user: User | undefined;
}

const FamilyTreeView = ({ user }: FamilyTreeProps) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyTreeMember[]>([]);
  const [familyRelations, setFamilyRelations] = useState<FamilyTreeRelation[]>(
    []
  );
  const [selectedMember, setSelectedMember] = useState<FamilyTreeMember | null>(
    null
  );
  const { isOpen, onOpen, onClose: onCloseModal } = useDisclosure();
  const [formData, setFormData] = useState<AddMemberData>({
    name: "",
    title: "",
    date_of_birth: "",
    date_of_death: "",
    relation_type: "child",
    related_member_id: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const toast = useToast();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleCreateSelf = async () => {
    try {
      const newMember: FamilyTreeMember = await createSelf();
      toast({
        title: "Family member created.",
        description: `Created family member for ${newMember.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchFamilyMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the family member.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchFamilyMembers = async () => {
    if (user && user.id !== undefined) {
      try {
        const members: FamilyTreeMember[] = await getFamilyMembersByOwner(
          user.id
        );
        setFamilyMembers(Array.isArray(members) ? members : []);
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error fetching family members.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "User ID is not defined.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchFamilyRelations = async () => {
    if (user && user.id !== undefined) {
      try {
        const relations: FamilyTreeRelation[] = await getRelationsById(user.id);
        setFamilyRelations(Array.isArray(relations) ? relations : []);
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error fetching family relations.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "User ID is not defined.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddMember = async () => {
    const formattedData: AddMemberData = {
      ...formData,
      date_of_birth: formData.date_of_birth || null,
      date_of_death: formData.date_of_death || null,
    };

    try {
      await addMember(formattedData);
      toast({
        title: "Family member added.",
        description: `Added ${formData.name} as a ${formData.relation_type} to ${selectedMember?.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchFamilyMembers();
      fetchFamilyRelations();
      handleClose();
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description: "There was an error adding the family member.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditMember = async () => {
    if (!selectedMember) return;

    const formattedData: AddMemberData = {
      ...formData,
      date_of_birth: formData.date_of_birth || null,
      date_of_death: formData.date_of_death || null,
    };

    try {
      await editFamilyMember(selectedMember.id, formattedData);
      toast({
        title: "Family member updated.",
        description: `Updated details for ${formData.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchFamilyMembers();
      fetchFamilyRelations();
      handleClose();
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Error",
        description: "There was an error updating the family member.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      try {
        await deleteFamilyMember(selectedMember.id);
        toast({
          title: "Family member deleted.",
          description: `Deleted family member`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchFamilyMembers();
        fetchFamilyRelations();
        setIsDeleteAlertOpen(false);
        handleClose();
      } catch (error) {
        console.error("Error deleting member:", error);
        toast({
          title: "Error",
          description: "There was an error deleting the family member.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const openModal = (member: FamilyTreeMember, isEdit: boolean) => {
    setSelectedMember(member);
    setFormData({
      ...formData,
      related_member_id: member.id,
      name: isEdit ? member.name : "",
      title: isEdit ? member.title : "",
      date_of_birth: isEdit ? member.date_of_birth : "",
      date_of_death: isEdit ? member.date_of_death : "",
      relation_type: "child",
    });
    setIsEditMode(isEdit);
    onOpen();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      title: "",
      date_of_birth: "",
      date_of_death: "",
      relation_type: "child",
      related_member_id: 0,
    });
    setSelectedMember(null);
    onCloseModal();
  };

  useEffect(() => {
    if (user && user.id !== undefined) {
      fetchFamilyMembers();
      fetchFamilyRelations();
    }
  }, [user]);

  const determineGenerations = (
    selfId: number,
    members: FamilyTreeMember[],
    relations: FamilyTreeRelation[]
  ): { [key: number]: number[] } => {
    const generations: { [key: number]: number[] } = {};
    const memberGenerations: { [id: number]: number } = {};
    const processedMembers = new Set<number>();

    const queue = [{ id: selfId, generation: 0 }];
    while (queue.length > 0) {
      const { id, generation } = queue.shift()!;
      if (processedMembers.has(id)) continue;
      processedMembers.add(id);
      memberGenerations[id] = generation;
      if (!generations[generation]) generations[generation] = [];
      generations[generation].push(id);

      relations.forEach((relation) => {
        if (
          relation.from_member.id === id &&
          !processedMembers.has(relation.to_member.id)
        ) {
          queue.push({
            id: relation.to_member.id,
            generation:
              relation.type === "vertical" ? generation + 1 : generation,
          });
        } else if (
          relation.to_member.id === id &&
          !processedMembers.has(relation.from_member.id)
        ) {
          queue.push({
            id: relation.from_member.id,
            generation:
              relation.type === "vertical" ? generation - 1 : generation,
          });
        }
      });
    }

    return generations;
  };

  const renderFamilyTree = () => {
    const selfMember = familyMembers.find((member) => member.title === "self");
    if (!selfMember) return null;

    const generations = determineGenerations(
      selfMember.id,
      familyMembers,
      familyRelations
    );

    const sortedGenerations = Object.keys(generations)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((key) => generations[parseInt(key)]);

    return sortedGenerations.map((generation, genIndex) => (
      <Flex key={genIndex} direction="row">
        {generation.map((memberId, memberIndex) => {
          const member = familyMembers.find((m) => m.id === memberId);
          if (!member) return <Box key={memberIndex} />;

          return (
            <Card
              key={memberIndex}
              minHeight="150px"
              minWidth="150px"
              height="150px"
              width="150px"
              m={1}
              p={3}
            >
              <Flex
                direction="column"
                height="100%"
                justifyContent="space-between"
              >
                <Box>
                  <Heading size="md" textAlign="center">
                    {`${member.title || ""} ${member.name}`}
                  </Heading>
                  <Box textAlign="center">
                    <Text>
                      {member.date_of_birth &&
                        renderShortBirthday(member.date_of_birth)}
                      {member.date_of_birth &&
                        member.date_of_death &&
                        ` - 
                        ${renderShortBirthday(member.date_of_death)}`}
                    </Text>
                  </Box>
                </Box>
                <Flex direction="row" justifyContent="space-between">
                  <FaUserPlus
                    cursor="pointer"
                    size="25px"
                    onClick={() => {
                      openModal(member, false);
                    }}
                  />

                  <FaGear
                    cursor="pointer"
                    size="25px"
                    onClick={() => {
                      openModal(member, true);
                    }}
                  />
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    ));
  };

  return (
    <Box p={4}>
      {familyMembers.length === 0 && (
        <Button colorScheme="teal" onClick={handleCreateSelf} mb={4}>
          Create Family Tree
        </Button>
      )}
      <Heading size="md" mb={2}>
        Family Tree
      </Heading>
      <Flex direction="row" alignItems="center" my={2}>
        <FaFlask />
        <Text ml={1}>This family tree app is in experimental phase.</Text>
      </Flex>
      <Box overflow="auto" maxH="600px" maxW="800px" border="1px black solid">
        {renderFamilyTree()}
      </Box>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Relative" : `Add Relative`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormControl>
            {formData.title !== "self" && (
              <FormControl mt={4}>
                <FormLabel>Title ('Uncle')</FormLabel>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </FormControl>
            )}
            <FormControl mt={4}>
              <FormLabel>Date of Birth (optional)</FormLabel>
              <Input
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />
            </FormControl>
            {formData.title !== "self" && (
              <FormControl mt={4}>
                <FormLabel>Date of Death (optional)</FormLabel>
                <Input
                  type="date"
                  value={formData.date_of_death || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_death: e.target.value })
                  }
                />
              </FormControl>
            )}
            {!isEditMode && (
              <FormControl mt={4}>
                <FormLabel>
                  Relationship to{" "}
                  {selectedMember && selectedMember.name
                    ? selectedMember.name
                    : ``}
                </FormLabel>
                <Select
                  value={formData.relation_type}
                  onChange={(e) =>
                    setFormData({ ...formData, relation_type: e.target.value })
                  }
                >
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="partner">Partner</option>
                </Select>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            {isEditMode ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={handleEditMember}>
                  Save Changes
                </Button>
                {formData.title !== "self" && (
                  <Button
                    colorScheme="red"
                    onClick={() => setIsDeleteAlertOpen(true)}
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : (
              <Button colorScheme="blue" mr={3} onClick={handleAddMember}>
                Add Member
              </Button>
            )}
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Family Member
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this family member? This action
              cannot be undone and may cascade delete other related family
              members.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteAlertOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteMember} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* <Heading size="md" mt={8} mb={4}>
        Family Relations
      </Heading>
      <ul>
        {Array.isArray(familyRelations) &&
          familyRelations.map((relation) => (
            <li key={relation.id}>
              {relation.from_member.name} is{" "}
              {relation.type === "vertical" ? "a parent" : "a partner"} of{" "}
              {relation.to_member.name}.
            </li>
          ))}
      </ul> */}
    </Box>
  );
};

export default FamilyTreeView;
