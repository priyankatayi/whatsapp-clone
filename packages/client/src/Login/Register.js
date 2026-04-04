import React, { useState } from "react";
import {
  Input,
  FormControl,
  FormErrorMessage,
  VStack,
  FormLabel,
  ButtonGroup,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { formSchema } from "@whatsapp-clone/common";
import { useAccountContext } from "../AccountContextProvider";

function Register() {
  const { setIsLoggedIn } = useAccountContext();

  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: formSchema,
    onSubmit: (values, actions) => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      })
        .catch((err) => console.log(err))
        .then((res) => {
          if (!res.ok || !res || res.status >= 400) return;
          return res.json();
        })
        .then((data) => {
          if (!data) return;
          if (data.status) {
            setError(data.status);
          } else {
            setIsLoggedIn(data.loggedIn);
            if (data.loggedIn) {
              navigate("/home");
            }
          }
        });
      actions.resetForm();
    },
  });
  const navigate = useNavigate();
  return (
    <VStack
      as="form"
      m="auto"
      w={{ base: "90%", md: "500px" }}
      justify="center"
      h="100vh"
      spacing="1rem"
      onSubmit={formik.handleSubmit}
    >
      <Heading>Sign Up</Heading>
      <Text as="p" color="red.500">
        {error}
      </Text>
      <FormControl
        isInvalid={formik.errors.username && formik.touched.username}
      >
        <FormLabel fontSize="lg">Username</FormLabel>
        <Input
          name="username"
          placeholder="Enter username"
          autoComplete="off"
          size="lg"
          {...formik.getFieldProps("username")}
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={formik.errors.password && formik.touched.password}
      >
        <FormLabel fontSize="lg">Password</FormLabel>
        <Input
          name="password"
          placeholder="Enter Password"
          autoComplete="off"
          size="lg"
          type="password"
          {...formik.getFieldProps("password")}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Create Account{" "}
          </Button>
          <Button onClick={() => navigate("/")} leftIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </ButtonGroup>
      </FormControl>
    </VStack>
  );
}

export default Register;
