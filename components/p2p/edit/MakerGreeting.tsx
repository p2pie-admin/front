import { VStack } from "@chakra-ui/react";
import Image from "next/image";
import greetings from "../../../public/greetings.png";
import CustomTitle from "../../shared/CustomTitle";
import { useT } from "../../../services/i18n";

const MakerGreeting = () => {
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
        style={{ width: "min(250px, 58vw)", height: "auto" }}
      />
      <CustomTitle
        as="h1"
        mt={{ base: "-20", lg: "-20" }}
        mb="0"
        title={t("Прокачай свой p2p обмен", "Level up your p2p exchange")}
        subtitle={
          t("Настрой личную p2p витрину. Накапливай уровань доверия за каждую сделку.", "Set up your personal p2p storefront. Build trust with every deal.")
        }
        subtitle2={t("Даем трафик клиентов. Берем безопасность сделок на себя.", "We bring you clients. We take care of deal security.")}
        subtitleProps={{
          mt: { base: 4, lg: 5 },
          lineHeight: { base: "1.45", lg: "1.35" },
          px: { base: 4, lg: 0 },
        }}
        subtitle2Props={{
          mt: { base: 5, lg: 6 },
          lineHeight: { base: "1.45", lg: "1.35" },
          px: { base: 4, lg: 0 },
        }}
      />
    </VStack>
  );
};

export default MakerGreeting;
