import { Box, Center, Text } from "@chakra-ui/react";

const ErrorMessage = ({
  errorMessage,
  feedback = false,
}: {
  errorMessage: string;
  feedback?: boolean;
}) => {
  return (
    <Center p="2">
      <Box p="2">
        <Text> {errorMessage} </Text>
        {feedback && "feedback"}
      </Box>
    </Center>
  );
};

export default ErrorMessage;
