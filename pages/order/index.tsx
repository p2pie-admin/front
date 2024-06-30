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
import Step1 from "../../components/order/step1";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import {
  Box3D,
  ResponsiveButton,
  ResponsiveText,
} from "../../styles/theme/custom";

import useSWR from "swr";
import { initCMSFetcher } from "../../services/fetchers";
import { IP2PStep } from "../../types/p2p";

import ErrorWrapper from "../../components/shared/ErrorWrapper";

import { useAppDispatch } from "../../redux/hooks";
import { getSavedOrders } from "../../redux/mainReducer";
import { getOrderByUID } from "../../redux/thunks";
import { useRouter } from "next/router";
import { StepsQuery } from "../../components/order/queries";
import Step2 from "../../components/order/step2";
import Step3 from "../../components/order/step3";
import OrderButton from "../../components/order/step3/OrderButton";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // must be async
  return {
    props: {
      ...(await serverSideTranslations(locale || "ru", ["common"])),
    },
  };
};

const Steps = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { uid } = router.query;

  useEffect(() => {
    dispatch(getSavedOrders()); //первичная загрузка, сперва пытаемся из localStorage
  }, []);
  useEffect(() => {
    // затем реверифицируемся и грузимся из uid
    uid &&
      setTimeout(() => {
        dispatch(getOrderByUID(uid as string));
      }, 2000);
  }, [uid]);
  // если есть в ссылке uid то грузимся от него, иначе скипаем
  // useEffect(() => {
  //   uid && dispatch(getOrderByUID(uid as string));
  // }, [uid]);

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

        <VStack minH="70vh" justifyContent="space-between" px={[2, 4]} pb="2">
          <Box w="100%">
            <Tabs index={tabIndex}>
              <TabPanels>
                {!!steps &&
                  steps.map((step) => (
                    <TabPanel px="0" py="4" key={step.en_title}>
                      <ResponsiveText size="lg">{step.en_title}</ResponsiveText>

                      <ResponsiveText size="sm" whiteSpace="normal">
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
