import { Button } from "@chakra-ui/react";
import { TbExternalLink } from "react-icons/tb";
import { LinkWrapper } from "../../../exchange/pmLayout/LinkWrapper";
import { enrichLink } from "../../../../redux/helper";
import { useAppSelector } from "../../../../redux/hooks";

type Props = {
  refLink?: string | null;
  fullWidth?: boolean;
};

const ExchangeButton = ({ refLink, fullWidth = false }: Props) => {
  const enrichedLink = useAppSelector((state) => {
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
        w={fullWidth ? "100%" : "auto"}
        minW={fullWidth ? undefined : "fit-content"}
        onClick={(e) => e.stopPropagation()}
      >
        Обмен
      </Button>
    </LinkWrapper>
  );
};

export default ExchangeButton;
