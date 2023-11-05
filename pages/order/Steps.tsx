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
import { ResponsiveButton, ResponsiveText } from "../../styles/theme/custom";

const steps = [
  { title: "Order Rates", description: "Rates & Limits" },
  { title: "Details", description: "Date & Regulations" },
  { title: "Confirmation", description: "Leave Contacts" },
];

function Steps() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <VStack minH="70vh" justifyContent="space-between">
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

              <Box
                flexShrink="0"
                display={{
                  base: tabIndex !== index ? "none" : "block",
                  sm: "block",
                }}
              >
                <ResponsiveText size="sm">{step.title}</ResponsiveText>

                <ResponsiveText size="xs">{step.description}</ResponsiveText>
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
          <ResponsiveButton
            leftIcon={<IoIosArrowRoundBack size="1.5rem" />}
            my="4"
            variant="contrast"
            onClick={() => setTabIndex(tabIndex - 1)}
          >
            {"PREVIOUS STEP"}
          </ResponsiveButton>
        ) : (
          <Box />
        )}
        {tabIndex == 2 ? (
          <ResponsiveButton my="4" variant="primary" onClick={() => {}}>
            {"SUGGEST EXCHANGE"}
          </ResponsiveButton>
        ) : (
          <ResponsiveButton
            my="4"
            variant="contrast"
            rightIcon={<IoIosArrowRoundForward size="1.5rem" />}
            onClick={() => setTabIndex(tabIndex + 1)}
          >
            {"NEXT STEP"}
          </ResponsiveButton>
        )}
      </HStack>
    </VStack>
  );
}

export default Steps;
