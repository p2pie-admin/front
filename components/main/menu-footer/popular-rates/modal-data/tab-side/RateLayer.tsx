import { useAppSelector } from "../../../../../../redux/hooks";
import { Box3D } from "../../../../../../styles/theme/wrappers";
import { IPopularRate } from "../../../../../../types/rates";
import {
  Box,
  Button,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import PmFullName from "../../../../../shared/PmFullName";

import {
  codeToSymbol,
  formatNumberInput,
  roundAmount,
} from "../../../../../../redux/amountsHelper";
import { capitalize } from "../../../../side/pmModalButton/section/PmGroup/helper";
import { useContext } from "react";
import SideContext from "../../../../../shared/SideContext";
import CircularIcon from "../../../../../shared/CircularIcon";

const RateLayer = ({
  code,
  rates,
}: {
  code: string;
  rates: IPopularRate[];
}) => {
  const pms = useAppSelector((state) => state.main.popularPms);
  const findPmByCode = (c: string) =>
    pms.find((pm) => pm.code.toUpperCase() === c);
  const cryptoPm = findPmByCode(code);
  const side = useContext(SideContext) as "buy" | "sell";
  const mainColor = useColorModeValue("secondary.600", "primary.200");

  if (!cryptoPm) return <></>;
  return (
    <Box3D p="4" mb="4" bgColor="bg.900" key={code}>
      <PmFullName pm={cryptoPm} />

      <TableContainer mt="4">
        <Table size="sm" colorScheme="bg">
          <Thead>
            <Tr>
              <Th color={mainColor}>{side === "buy" ? "Pay by" : "Receive"}</Th>
              <Th color={mainColor} isNumeric>
                Starting from
              </Th>
              <Th color={mainColor}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {rates.map((rate) => {
              const pm = findPmByCode(rate.fiat);
              if (!pm) return <Tr></Tr>;
              const name = capitalize(pm.en_name);
              const course = `~ ${codeToSymbol(
                pm.currency.code
              )} ${formatNumberInput(roundAmount(rate.course))}`;
              return (
                <Tr>
                  <Td>
                    <HStack>
                      <CircularIcon color={pm.color} small icon={pm.icon} />{" "}
                      <Text>{name}</Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>{course}</Td>
                  <Td isNumeric>
                    <Button
                      colorScheme={side === "buy" ? "green" : "pink"}
                      size="xs"
                      px="1"
                      mt="1"
                      minH="6"
                      borderRadius="lg"
                    >
                      {`${capitalize(
                        side
                      )} ${cryptoPm.currency.code.toUpperCase()}`}
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {/* <Text textAlign="end" mt="2" color="bg.500">
          Total Exchangers: 72
        </Text> */}
      </TableContainer>
    </Box3D>
  );
};

export default RateLayer;
