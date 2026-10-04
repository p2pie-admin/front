import {
  Box,
  Link as ChakraLink,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { ResponsiveText } from "../../styles/theme/custom";
import { buildRateString } from "../shared/helper";
import { exchangerNameToSlug } from "../exchangers/helper";
import { ISsrRate } from "./ssrRates";
import { localFormat } from "../../redux/amountsHelper";

// Rows shown at once; the rest sit inside a native <details> so the HTML stays crawlable
// without a 40-row wall on screen.
const VISIBLE_ROWS = 100;

// Plain, crawlable table of every offer for the direction. Rendered on the server from
// page props, so the HTML carries the real exchangers even before any JS runs.
// Rendered in the full-width block under the two columns. Phones: #, exchanger (rating + compact
// limits underneath), rate, arrow. From md: limits and reserve get their own columns.
const wideOnly = { base: "none", md: "table-cell" } as const;
// No time-dependent cells here: anything like "updated 5 s ago" differs between the
// server render and the client and breaks hydration.
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
  const head = rates.slice(0, VISIBLE_ROWS);
  const tail = rates.slice(VISIBLE_ROWS);

  const renderRows = (list: ISsrRate[], offset: number) =>
    list.map((rate, index) => {
      const name = rate.display_name || rate.name || "";
      const side = rate.course > 1 ? "give" : "get";
      const smallCur = side === "give" ? giveCur : getCur;
      const min = Number(rate.min?.[side]) || 0;
      const max = Number(rate.max?.[side]) || 0;
      // Same compact style as the swiper cards ("15 тыс ₽ — 250 тыс ₽") so it fits under the name.
      const reserve = Number(rate.reserve?.get) || 0;
      const limits = min || max ? `${localFormat(min, smallCur)} — ${localFormat(max, smallCur)}` : "";
      return (
        <Tr key={`offer_${rate.exchangerId}`}>
          <Td px={{ base: 1, md: 2 }}>{offset + index + 1}</Td>
          <Td px={{ base: 1, md: 2 }} maxW={{ base: "128px", md: "unset" }} overflow="hidden">
            <ChakraLink
              as={Link}
              href={`/exchangers/${exchangerNameToSlug(rate.name)}`}
              prefetch={false}
              fontWeight="600"
              display="block"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {name}
            </ChakraLink>
            <ResponsiveText
              as="span"
              size="xs"
              variant="no_contrast"
              display="block"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              <Box as="span" display={{ base: "inline", md: "none" }}>
                {[rate.admin_rating ? `★ ${rate.admin_rating}` : "", limits].filter(Boolean).join(" · ")}
              </Box>
              <Box as="span" display={{ base: "none", md: "inline" }}>
                {rate.admin_rating ? `★ ${rate.admin_rating}` : ""}
              </Box>
            </ResponsiveText>
          </Td>
          <Td px={{ base: 1, md: 2 }} whiteSpace="nowrap">
            {buildRateString({ course: rate.course, giveCur, getCur })}
          </Td>
          <Td display={wideOnly} whiteSpace="nowrap">
            {limits || "—"}
          </Td>
          <Td display={wideOnly} isNumeric whiteSpace="nowrap">
            {reserve ? localFormat(reserve, getCur) : "—"}
          </Td>
          <Td px={{ base: 1, md: 2 }} w="1%">
            {rate.ref_link ? (
              <ChakraLink
                href={rate.ref_link}
                isExternal
                rel="nofollow sponsored noopener"
                color="peach.300"
                whiteSpace="nowrap"
                aria-label={`Перейти на ${name}`}
              >
                <Box as="span" display={{ base: "none", md: "inline" }}>
                  Перейти →
                </Box>
                <Box as="span" display={{ base: "inline", md: "none" }}>
                  →
                </Box>
              </ChakraLink>
            ) : null}
          </Td>
        </Tr>
      );
    });

  const table = (rows: ISsrRate[], offset: number, withHead: boolean) => (
    <Table size="sm" variant="simple" fontSize={{ base: "xs", md: "sm" }}>
      {withHead ? (
        <Thead>
          <Tr>
            <Th px={{ base: 1, md: 2 }}>#</Th>
            <Th px={{ base: 1, md: 2 }}>Обменник</Th>
            <Th px={{ base: 1, md: 2 }}>Курс</Th>
            <Th display={wideOnly}>Лимиты</Th>
            <Th display={wideOnly} isNumeric>
              Резерв
            </Th>
            <Th px={{ base: 1, md: 2 }}></Th>
          </Tr>
        </Thead>
      ) : null}
      <Tbody>{renderRows(rows, offset)}</Tbody>
    </Table>
  );

  return (
    <Box mt="6" w="100%" minW="0" maxW="100%" overflowX="auto">
      {table(head, 0, true)}
      {tail.length ? (
        <Box as="details" mt="2">
          <Box
            as="summary"
            cursor="pointer"
            fontSize="sm"
            color="peach.300"
            py="2"
            _hover={{ textDecoration: "underline" }}
          >
            {`Показать ещё ${tail.length} ${
              tail.length === 1 ? "предложение" : tail.length < 5 ? "предложения" : "предложений"
            }`}
          </Box>
          {table(tail, head.length, false)}
        </Box>
      ) : null}
      {hidden ? (
        <ResponsiveText size="xs" variant="no_contrast" mt="2">
          {`Остальные ${hidden} предложений — в живом списке выше.`}
        </ResponsiveText>
      ) : null}
    </Box>
  );
};

export default OffersTable;
