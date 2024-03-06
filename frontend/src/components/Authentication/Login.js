import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const [Show, SetShow] = useState(false);
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [Loading, SetLoading] = useState(false);

  const handleSubmit = async () => {
    SetLoading(true);
    if (!Email || !Password) {
      toast({
        title: "Fill all.",
        description: "Please fill all the feild.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      SetLoading(false);
      return;
    }
    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const {data} = await axios.post(
        "/api/user/login",
        { email: Email, password: Password },
        config
      );
      toast({
        title: "Login Successfully",
        description: "Now we are moving you forward",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      SetLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    SetLoading(false);
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          type="text"
          value={Email}
          onChange={(e) => SetEmail(e.target.value)}
          placeholder="Enter Your Email."
          size="sm"></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={Show ? "text" : "password"}
            value={Password}
            onChange={(e) => SetPassword(e.target.value)}
            placeholder="Enter Your Password."
            size="sm"></Input>
          <InputRightElement w="3.5rem">
            <Button h="1.3rem" size="sm" onClick={() => SetShow(!Show)}>
              {Show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        type="submit"
        w="100%"
        colorScheme="blue"
        mt={4}
        isLoading={Loading}
        onClick={handleSubmit}>
        Login
      </Button>
      <Button
        type="button"
        w="100%"
        colorScheme="red"
        mt={1}
        onClick={() => {
          SetEmail("gautams4205@gmail.com");
          SetPassword("12345");
        }}>
        Guest User Credentials
      </Button>
    </VStack>
  );
}
