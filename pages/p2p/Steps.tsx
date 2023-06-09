import {
  useSteps,
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
} from "@chakra-ui/react";
import { useState } from "react";
import SelectCurrency from "./select-pms-step";
import SelectPmsStep from "./select-pms-step";

const steps = [
  { title: "First", description: "Contact Info" },
  { title: "Second", description: "Date & Time" },
  { title: "Third", description: "Select Rooms" },
];

function Steps() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      <Stepper index={tabIndex}>
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

      <Tabs isLazy index={tabIndex}>
        <TabPanels>
          <TabPanel>
            <SelectCurrency />
          </TabPanel>
          <TabPanel>
            <p>Yeah yeah. What's up?</p>
          </TabPanel>
          <TabPanel>
            <p>Oh, hello there.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <HStack>
        <Button onClick={() => setTabIndex(tabIndex - 1)}>previous</Button>
        <Button onClick={() => setTabIndex(tabIndex + 1)}>next</Button>
      </HStack>
    </Box>
  );
}

export default Steps;
