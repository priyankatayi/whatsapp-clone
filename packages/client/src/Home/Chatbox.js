import { HStack, Button, Input } from "@chakra-ui/react";
import { Field, Formik, Form } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { MessagesContext } from "./Home";
import socket from "../socket";

function Chatbox({ userid }) {
  const { messages, setMessages } = useContext(MessagesContext);
  return (
    <Formik
      initialValues={{ message: "" }}
      validationSchema={Yup.object({
        message: Yup.string().min(1).max(255),
      })}
      onSubmit={(values, actions) => {
        const message = { to: userid, content: values.message, from: null };
        socket.emit("message", message);
        setMessages((prev) => [...prev, message]);
        actions.resetForm();
      }}
    >
      <HStack as={Form} w="100%" pb="1.4rem" px="1.4rem">
        <Input
          as={Field}
          name="message"
          placeholder="Type your message here..."
          size="lg"
          autoComplete="off"
        />
        <Button colorScheme="teal" size="lg" type="submit">
          Send
        </Button>
      </HStack>
    </Formik>
  );
}

export default Chatbox;
