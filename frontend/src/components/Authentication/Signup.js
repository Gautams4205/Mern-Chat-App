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
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const toast = useToast();
  const navigate = useNavigate();
  const [Show, SetShow] = useState(false);
  const [name, Setname] = useState("");
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [ConformPassword, SetConformPassword] = useState("");
  const [Pic, SetPic] = useState();
  const [Loading, SetLoading] = useState(false);

  const postDetail = (pics) => {
    SetLoading(true);
    if (pics === undefined) {
      toast({
        title: "Select Image.",
        description: "Please select image.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      SetLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dc6ptesqn");
      fetch("https://api.cloudinary.com/v1_1/dc6ptesqn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          SetPic(data.url.toString());
          SetLoading(false);
        })
        .catch((err) => {
          console.log(err);
          SetLoading(false);
        });
    } else {
      toast({
        title: "Select Image.",
        description: "Please select image in jpeg or png format.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      SetLoading(false);
      return;
    }
  };

  const handleSubmit = async () => {
    SetLoading(true);
    if (!name || !Email || !Password || !ConformPassword) {
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
    if (Password !== ConformPassword) {
      toast({
        title: "Password dismatch.",
        description: "Please fill same password.",
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
      const { data } = await axios.post(
        "/api/user/signup",
        { name: name, email: Email, password: Password, pic: Pic },
        config
      );
      toast({
        title: "Registered Successfully",
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
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          type="text"
          onChange={(e) => Setname(e.target.value)}
          placeholder="Enter Your Name."
          size="sm"></Input>
      </FormControl>
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
      <FormControl>
        <FormLabel>ConformPassword</FormLabel>
        <InputGroup>
          <Input
            type={Show ? "text" : "password"}
            value={ConformPassword}
            onChange={(e) => SetConformPassword(e.target.value)}
            placeholder="Enter Your Password."
            size="sm"></Input>
          <InputRightElement w="3.5rem">
            <Button h="1.3rem" size="sm" onClick={() => SetShow(!Show)}>
              {Show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Pic</FormLabel>
        <Input
          type="file"
          onChange={(e) => postDetail(e.target.files[0])}
          accept="image/*"
          size="1em"></Input>
      </FormControl>
      <Button
        type="submit"
        w="100%"
        colorScheme="blue"
        mt={15}
        isLoading={Loading}
        onClick={handleSubmit}>
        Signin
      </Button>
    </VStack>
  );
}
