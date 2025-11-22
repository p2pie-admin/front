import { Button } from "@chakra-ui/react";
import { TbExternalLink } from "react-icons/tb";
import { LinkWrapper } from "../../../exchange/pmLayout/LinkWrapper";
import { enrichLink } from "../../../../redux/helper";
import { useAppSelector } from "../../../../redux/hooks";

const ExchangeButton = ({ refLink }: { refLink?: string | null }) => {
  const enrichedLink = useAppSelector((state) => {
    // giveCode?: string,
    // getCode?: string,
    // cityCode?: any
    const { city, givePm, getPm } = state.main;

    return enrichLink({
      refLink,
      givePm,
      getPm,
      cityCode: city?.codes[0],
    });
  });
  return (
    <LinkWrapper url={enrichedLink} exists={!!refLink} _blank>
      <Button
        variant="primary"
        rightIcon={<TbExternalLink size="1.2rem" />}
        w="100%"
      >
        Обмен
      </Button>
    </LinkWrapper>
  );
};

export default ExchangeButton;
