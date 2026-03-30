import React, { useState } from "react";
import { VStack, ButtonGroup, Button, Heading, Text } from "@chakra-ui/react";

import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";

import { formSchema } from "@whatsapp-clone/common";

import { useAccountContext } from "../AccountContextProvider";
import TextField from "./TextField";

function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAccountContext();
  const [error, setError] = useState("");

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={formSchema}
      onSubmit={(values, actions) => {
        const val = { ...values };
        actions.resetForm();
        console.log("POST");
        fetch("https://whatsapp-clone-server-1rbm.onrender.com/auth/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(val),
        })
          .catch((err) => {
            return;
          })
          .then((res) => {
            if (!res.ok || !res || res.status >= 400) return;
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            if (data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
              setIsLoggedIn(data.loggedIn);
              if (data.loggedIn) {
                navigate("/home");
              }
            }
          });
      }}
    >
      <VStack
        as={Form}
        m="auto"
        w={{ base: "90%", md: "500px" }}
        justify="center"
        h="100vh"
        spacing="1rem"
      >
        <Heading>Log In</Heading>
        <Text as="p" color="red.500">
          {error}
        </Text>
        <TextField
          name="username"
          placeholder="Enter username"
          autoComplete="off"
          label="Username"
        />

        <TextField
          name="password"
          placeholder="Enter Password"
          autoComplete="off"
          type="password"
          label="Password"
        />
        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>Create Account </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
}

export default Login;
