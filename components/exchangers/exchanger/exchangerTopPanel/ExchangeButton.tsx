import { Button } from "@chakra-ui/react";
import { TbExternalLink } from "react-icons/tb";
import { LinkWrapper } from "../../../shared/LinkWrapper";
import { enrichLink } from "../../../../redux/helper";
import { useAppSelector } from "../../../../redux/hooks";
import { useT } from "../../../../services/i18n";

type Props = {
  refLink?: string | null;
  fullWidth?: boolean;
};

const ExchangeButton = ({ refLink, fullWidth = false }: Props) => {
  const t = useT();
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
    <LinkWrapper
      url={enrichedLink}
      exists={!!refLink}
      _blank
      //style={{ width: "100%" }}
    >
      <Button
        variant="primary"
        rightIcon={<TbExternalLink size="1.2rem" />}
        w="100%"
        onClick={(e) => e.stopPropagation()}
      >
        {t("Обмен", "Exchange")}
      </Button>
    </LinkWrapper>
  );
};

export default ExchangeButton;
