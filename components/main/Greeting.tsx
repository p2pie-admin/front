import { VStack } from "@chakra-ui/react";
import Image from "next/image";
import greetings from "../../public/greetings.png";
import CustomTitle from "../shared/CustomTitle";
import { useT } from "../../services/i18n";

const Greeting = () => {
  const t = useT();
  return (
    <VStack
      gap={{ base: "4", lg: "-20" }}
      my={{ base: "4", lg: "10" }}
      zIndex="1"
    >
      <Image
        alt={`${process.env.NEXT_PUBLIC_NAME} greetings`}
        src={greetings}
        width={250}
        loading="eager"
      />
      <CustomTitle
        as="h1"
        mt="-20"
        mb="0"
        title={t("Все обменники в одном месте", "All exchangers in one place")}
        subtitle={t(
          "Поиск курсов обмена среди 1000+ обменников и p2p",
          "Search exchange rates across 1000+ exchangers and p2p"
        )}
      />
    </VStack>
  );
};

export default Greeting;
