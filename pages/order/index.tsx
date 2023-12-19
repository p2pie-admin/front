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
import Step1 from "./step1";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import {
  Box3D,
  ResponsiveButton,
  ResponsiveText,
} from "../../styles/theme/custom";
import Step2 from "./step2";

const steps = [
  { title: "Suggest Rate", description: "Prices & Limits" },
  { title: "Regulations", description: "Exchange Details" },
  { title: "Confirmation", description: "Leave Contacts" },
];

function Steps() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box3D variant="contrast" w={{ base: "100%", md: 600 }}>
      <Box3D
        variant="no_contrast"
        borderBottom="none"
        boxShadow="lg"
        borderBottomRadius="0"
        p={[2, 4]}
      >
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
      </Box3D>

      <VStack minH="74vh" justifyContent="space-between" p={[2, 4]}>
        <Box w="100%">
          <Tabs index={tabIndex}>
            <TabPanels>
              <TabPanel px="0" py="4">
                <Step1 />
              </TabPanel>
              <TabPanel px="0" py="4">
                <Step2 />
              </TabPanel>
              <TabPanel px="0" py="4">
                <Text>
                  Contact our operator on Telegram to confirm your order.
                </Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <HStack w="100%" justifyContent="space-between">
          {tabIndex > 0 ? (
            <ResponsiveButton
              leftIcon={<IoIosArrowRoundBack size="1.5rem" />}
              mb="1"
              variant="no_contrast"
              onClick={() => setTabIndex(tabIndex - 1)}
            >
              {"PREVIOUS STEP"}
            </ResponsiveButton>
          ) : (
            <Box />
          )}
          {tabIndex == 2 ? (
            <ResponsiveButton mb="1" variant="primary" onClick={() => {}}>
              {"SUGGEST EXCHANGE"}
            </ResponsiveButton>
          ) : (
            <ResponsiveButton
              mb="1"
              variant="no_contrast"
              rightIcon={<IoIosArrowRoundForward size="1.5rem" />}
              onClick={() => setTabIndex(tabIndex + 1)}
            >
              {"NEXT STEP"}
            </ResponsiveButton>
          )}
        </HStack>
      </VStack>
    </Box3D>
  );
}

export default Steps;
