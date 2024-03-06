import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Homepage from "./components/Homepage";
import Chatpage from "./components/Chatpage";
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
          <Router>
        <ChatProvider>
            <Routes>
              <Route exact path="/" element={<Homepage />} />
              <Route exact path="/chats" element={<Chatpage />} />
            </Routes>
        </ChatProvider>
          </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
