import { Box, Link as ChakraLink } from "@chakra-ui/react";
import { FaTelegramPlane } from "react-icons/fa";
import { ResponsiveText } from "../../styles/theme/custom";
import { cityChannel } from "./tgChannels";
import { useT } from "../../services/i18n";

// Plain one-line link under the offers summary: daily cash rates of the city in Telegram.
// The click is recorded by the global ClickTracker through the data-track attributes.
const CityChannelLink = ({
  citySlug,
  cityName,
}: {
  citySlug?: string | null;
  cityName?: string | null;
}) => {
  const t = useT();
  const channel = cityChannel(citySlug);
  if (!channel) return null;
  return (
    // ResponsiveText is nowrap by default: this line is ~410px, wider than a phone, and it used to
    // stretch the whole page column past the viewport on city pages.
    <ResponsiveText size="sm" mt="3" whiteSpace="normal">
      <ChakraLink
        href={`https://t.me/${channel}`}
        isExternal
        rel="noopener"
        color="peach.300"
        display="inline-flex"
        alignItems="center"
        gap="2"
        data-track="city-channel"
        data-track-label={channel}
      >
        <Box as="span" display="inline-flex" flexShrink={0}>
          <FaTelegramPlane />
        </Box>
        {t(
          `Курсы${cityName ? ` ${cityName}` : ""} каждый день в Telegram: @${channel}`,
          `${cityName ? `${cityName} rates` : "Rates"} every day on Telegram: @${channel}`,
        )}
      </ChakraLink>
    </ResponsiveText>
  );
};

export default CityChannelLink;
