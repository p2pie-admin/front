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
import { useEffect, useState } from "react";
import Step1 from "./step1";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import {
  Box3D,
  ResponsiveButton,
  ResponsiveText,
} from "../../styles/theme/custom";
import Step2 from "./step2";
import Step3 from "./step3";

import useSWR from "swr";
import { initCMSFetcher } from "../../services/fetchers";
import { IP2PStep } from "../../types/p2p";
import { StepsQuery } from "./queries";
import ErrorWrapper from "../../components/shared/ErrorWrapper";
import OrderButton from "./step3/OrderButton";

import { useAppDispatch } from "../../redux/hooks";
import { getSavedOrders } from "../../redux/mainReducer";
import { getOrderByIP, getOrderByUID } from "../../redux/thunks";
import { useRouter } from "next/router";

const Steps = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { uid } = router.query;

  // первичная загрузка, сперва пытаемся из localStorage загрузиться,
  // и если не удалось, то пробуем по IP
  useEffect(() => {
    dispatch(getSavedOrders());
    setTimeout(() => dispatch(getOrderByIP()), 2000);
  }, []);

  // если есть в ссылке uid то грузимся от него, иначе скипаем
  useEffect(() => {
    uid && dispatch(getOrderByUID(uid as string));
  }, [uid]);

  const stepComponents = [<Step1 />, <Step2 />, <Step3 />];
  const fetcher = initCMSFetcher();
  const { data, error } = useSWR(StepsQuery, fetcher) as {
    data: {
      steps: any;
    };
    error: boolean;
  };

  const steps = data?.steps.map((s: IP2PStep, index: number) => ({
    ...s,
    component: stepComponents[index],
  })) as IP2PStep[];

  return (
    <ErrorWrapper isError={!!error} isLoading={!steps}>
      <Box3D variant="contrast" w={{ base: "100%", md: 600 }}>
        <Box3D
          variant="no_contrast"
          borderBottom="none"
          boxShadow="lg"
          borderBottomRadius="0"
          p={[2, 4]}
        >
          <Stepper index={tabIndex} colorScheme="peach" size="sm">
            {!!steps &&
              steps.map((step, index) => (
                <Step key={step.en_title}>
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
                    <ResponsiveText size="sm">
                      {step.en_stepper_title}
                    </ResponsiveText>

                    <ResponsiveText size="xs">
                      {step.en_stepper_description}
                    </ResponsiveText>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
          </Stepper>
        </Box3D>

        <VStack minH="74vh" justifyContent="space-between" px={[2, 4]} pb="2">
          <Box w="100%">
            <Tabs index={tabIndex}>
              <TabPanels>
                {!!steps &&
                  steps.map((step) => (
                    <TabPanel px="0" py="4" key={step.en_title}>
                      <ResponsiveText>{step.en_title}</ResponsiveText>

                      <ResponsiveText size="xs" whiteSpace="normal">
                        {step.en_description}
                      </ResponsiveText>
                      {step.component}
                    </TabPanel>
                  ))}
              </TabPanels>
            </Tabs>
          </Box>

          <HStack w="100%" justifyContent="space-between" mb="2">
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
              <OrderButton />
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
    </ErrorWrapper>
  );
};

export default Steps;
