import { Box, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../../redux/hooks";

const SelectPms = ({ currencyCode }: { currencyCode: string }) => {
  const pmsByCurrency = useAppSelector((state) =>
    state.main.popularPms.filter(
      (pm) => pm.currency.code.toUpperCase() === currencyCode.toUpperCase()
    )
  );

  return (
    <Box>
      {pmsByCurrency.map((pm) => (
        <Text>{pm.code}</Text>
      ))}
    </Box>
  );
};

export default SelectPms;
