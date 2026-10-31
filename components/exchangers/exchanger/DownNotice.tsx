import { Box, HStack, Text } from "@chakra-ui/react";
import { MdErrorOutline } from "react-icons/md";
import { IExchanger } from "../../../types/exchanger";
import { IExchangerUptime } from "./Uptime";
import { intlLocale, useLocale, useT } from "../../../services/i18n";

// Down = the parser suspended the exchanger (its rates feed keeps failing), or it answered in less than 80 % of the
// hourly checks and the last one failed. Such a page must not look like a working exchanger with an «Обмен» button.
export const isExchangerDown = (exchanger: IExchanger, uptime?: IExchangerUptime | null) =>
  exchanger.status === "suspended" || (!!uptime?.lastError && uptime.uptimePct < 80);

const DownNotice = ({ uptime }: { uptime?: IExchangerUptime | null }) => {
  const t = useT();
  const locale = useLocale();
  const since = uptime?.lastOk
    ? new Intl.DateTimeFormat(intlLocale(locale), { timeZone: "Europe/Moscow", day: "numeric", month: "long" }).format(
        new Date(uptime.lastOk),
      )
    : null;
  return (
    <Box w="100%" my="2" p="4" borderRadius="xl" borderWidth="1px" borderColor="orange.300" bgColor="blackAlpha.300">
      <HStack alignItems="start" gap="3">
        <Box color="orange.300" pt="0.5">
          <MdErrorOutline size="1.4rem" />
        </Box>
        <Text color="bg.200" fontSize="sm">
          {since
            ? t(
                `Курсы обменника не отвечают нашему мониторингу с ${since}. Пока выгрузка не восстановится, обменника нет в таблицах курсов. Перед обменом убедитесь, что сайт работает.`,
                `The exchanger's rates have not answered our monitoring since ${since}. Until the feed is back, the exchanger is not shown in rate tables. Make sure the website works before exchanging.`,
              )
            : t(
                "Курсы обменника сейчас не отвечают нашему мониторингу, поэтому его нет в таблицах курсов. Перед обменом убедитесь, что сайт работает.",
                "The exchanger's rates are not answering our monitoring right now, so it is not shown in rate tables. Make sure the website works before exchanging.",
              )}
        </Text>
      </HStack>
    </Box>
  );
};

export default DownNotice;
