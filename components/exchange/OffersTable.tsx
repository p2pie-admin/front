import {
  Box,
  Link as ChakraLink,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { ResponsiveText } from "../../styles/theme/custom";
import { buildRateString, secondsAgo } from "../shared/helper";
import { exchangerNameToSlug } from "../exchangers/helper";
import { formatAmount, ISsrRate } from "./ssrRates";

// Plain, crawlable table of every offer for the direction. Rendered on the server from
// page props, so the HTML carries the real exchangers even before any JS runs.
const OffersTable = ({
  rates,
  total,
  giveCur,
  getCur,
}: {
  rates: ISsrRate[] | null | undefined;
  total?: number | null;
  giveCur: string;
  getCur: string;
}) => {
  if (!rates || !rates.length) return null;
  const hidden = total && total > rates.length ? total - rates.length : 0;

  return (
    <Box mt="6">
      <TableContainer>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Обменник</Th>
              <Th>Курс</Th>
              <Th>Лимиты</Th>
              <Th isNumeric>Резерв</Th>
              <Th>Обновлено</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {rates.map((rate, index) => {
              const name = rate.display_name || rate.name || "";
              const side = rate.course > 1 ? "give" : "get";
              const smallCur = side === "give" ? giveCur : getCur;
              const min = Number(rate.min?.[side]) || 0;
              const max = Number(rate.max?.[side]) || 0;
              const reserve = Number(rate.reserve?.get) || 0;
              return (
                <Tr key={`offer_${rate.exchangerId}`}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <ChakraLink
                      as={Link}
                      href={`/exchangers/${exchangerNameToSlug(rate.name)}`}
                      prefetch={false}
                      fontWeight="600"
                    >
                      {name}
                    </ChakraLink>
                    {rate.admin_rating ? (
                      <ResponsiveText
                        as="span"
                        size="xs"
                        variant="no_contrast"
                        ml="2"
                      >
                        {`★ ${rate.admin_rating}`}
                      </ResponsiveText>
                    ) : null}
                  </Td>
                  <Td whiteSpace="nowrap">
                    {buildRateString({ course: rate.course, giveCur, getCur })}
                  </Td>
                  <Td whiteSpace="nowrap">
                    {min || max
                      ? `${formatAmount(min, smallCur)} — ${formatAmount(
                          max,
                          smallCur,
                        )}`
                      : "—"}
                  </Td>
                  <Td isNumeric whiteSpace="nowrap">
                    {reserve ? formatAmount(reserve, getCur) : "—"}
                  </Td>
                  <Td whiteSpace="nowrap">
                    {rate.last_time_updated
                      ? secondsAgo(rate.last_time_updated)
                      : "—"}
                  </Td>
                  <Td>
                    {rate.ref_link ? (
                      <ChakraLink
                        href={rate.ref_link}
                        isExternal
                        rel="nofollow sponsored noopener"
                        color="peach.300"
                        whiteSpace="nowrap"
                      >
                        Перейти →
                      </ChakraLink>
                    ) : null}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {hidden ? (
        <ResponsiveText size="xs" variant="no_contrast" mt="2">
          {`Ещё ${hidden} предложений доступно в списке выше.`}
        </ResponsiveText>
      ) : null}
    </Box>
  );
};

export default OffersTable;
