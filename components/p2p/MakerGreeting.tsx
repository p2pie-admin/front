import { VStack } from "@chakra-ui/react";
import Image from "next/image";
import greetings from "../../public/greetings.png";
import CustomTitle from "../shared/CustomTitle";

const MakerGreeting = () => {
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
        priority
      />
      <CustomTitle
        as="h1"
        mt="-20"
        mb="0"
        title={"Прокачай свой p2p обмен"}
        subtitle={
          "Настрой p2p витрину, получай заказы и копи рейтинг доверия. Это бесплатно."
        }
      />
    </VStack>
  );
};

export default MakerGreeting;
