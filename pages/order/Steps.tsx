import {
  Text,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  Box,
  StepTitle,
  StepDescription,
  StepSeparator,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import FirstStep from "./first-step";
import SelectPmsStep from "./first-step";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";

const steps = [
  { title: "Create Order", description: "Suggest Your Rates" },
  { title: "Details", description: "Date & Regulations" },
  { title: "Confirmation", description: "Leave Contacts" },
];

function Steps() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <VStack h="90%" justifyContent="space-between">
      <Box w="100%">
        <Stepper index={tabIndex} colorScheme="peach" size="sm">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        <Tabs index={tabIndex}>
          <TabPanels>
            <TabPanel px="0" py="4">
              <FirstStep />
            </TabPanel>
            <TabPanel px="0" py="4">
              <p>Yeah yeah. What's up?</p>
            </TabPanel>
            <TabPanel px="0" py="4">
              <Text>
                Contact our operator on Telegram to confirm your order.{" "}
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <HStack w="100%" mt="6" justifyContent="space-between">
        {tabIndex > 0 ? (
          <Button
            leftIcon={<IoIosArrowRoundBack size="1.5rem" />}
            variant="default"
            onClick={() => setTabIndex(tabIndex - 1)}
          >
            {"PREVIOUS STEP"}
          </Button>
        ) : (
          <Box />
        )}
        {tabIndex == 2 ? (
          <Button variant="primary" onClick={() => {}}>
            {"SUGGEST EXCHANGE"}
          </Button>
        ) : (
          <Button
            rightIcon={<IoIosArrowRoundForward size="1.5rem" />}
            variant="default"
            onClick={() => setTabIndex(tabIndex + 1)}
          >
            {"NEXT STEP"}
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

export default Steps;
