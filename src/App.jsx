import { useState, useEffect } from "react";
import { Amplify, API, graphqlOperation, Auth } from "aws-amplify";
import {
  Authenticator,
  Heading,
  Flex,
  TextField,
  TextAreaField,
  Button,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@aws-amplify/ui-react";

import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const initialState = { name: "", description: "" };

function App() {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql({
        query: listTodos,
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos", err);
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setFormState(initialState);
      await API.graphql({
        query: createTodo,
        variables: { input: todo },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      await fetchTodos();
    } catch (err) {
      console.error("error creating todo:", err);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Flex
          maxWidth={600}
          minHeight="100vh"
          margin="auto"
          direction="column"
          justifyContent="center"
        >
          <Flex>
            <Heading level={2} fontWeight="bold" textTransform="capitalize">
              Welcome {user.username}
            </Heading>
            <Button onClick={signOut}>Sign Out</Button>
          </Flex>
          <TextField
            label="Todo"
            placeholder="Todo Name"
            onChange={(event) => setInput("name", event.target.value)}
            value={formState.name}
          />
          <TextAreaField
            label="Description"
            placeholder="Todo Description"
            onChange={(event) => setInput("description", event.target.value)}
            value={formState.description}
          />
          <Button variation="primary" isFullWidth onClick={addTodo}>
            Create Todo!
          </Button>
          <Divider />
          <Heading level={4}>Your Todos</Heading>
          <Table variation="striped">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo, i) => (
                <TableRow key={todo.id}>
                  <TableCell>{++i}</TableCell>
                  <TableCell>{todo.name}</TableCell>
                  <TableCell>{todo.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Flex>
      )}
    </Authenticator>
  );
}

export default App;
