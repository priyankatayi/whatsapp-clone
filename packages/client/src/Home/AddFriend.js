import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
} from "@chakra-ui/react";
import TextField from "../Login/TextField";
import { Form, Formik } from "formik";
import { FriendsContext } from "./Home";
import { useContext, useState } from "react";
import { friendSchema } from "@whatsapp-clone/common";
import socket from "../socket";
import { useCallback } from "react";

function AddFriend({ isOpen, onClose }) {
  const { friendsList, setFriendsList } = useContext(FriendsContext);
  const [error, setError] = useState("");

  const closeModal = useCallback(() => {
    onClose();
    setError("");
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Heading as="p" size="lg" p={3} color="red.500" textAlign="center">
          {error}
        </Heading>
        <ModalHeader>Add a Friend</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendsName: "" }}
          onSubmit={(values) => {
            socket.emit(
              "add friend",
              values.friendsName.toLowerCase(),
              ({ errorMsg, done, newFriend }) => {
                if (done) {
                  setFriendsList([...friendsList, newFriend]);
                  closeModal();
                  return;
                } else {
                  setError(errorMsg);
                }
              },
            );
          }}
          validationSchema={friendSchema}
        >
          <Form>
            <ModalBody>
              <TextField
                label="Friend's name"
                placeholder="Enter friend's name"
                autoComplete="off"
                name="friendsName"
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                {" "}
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
}

export default AddFriend;
