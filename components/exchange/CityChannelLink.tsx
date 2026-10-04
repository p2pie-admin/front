import { Link as ChakraLink } from "@chakra-ui/react";
import { FaTelegramPlane } from "react-icons/fa";
import { ResponsiveText } from "../../styles/theme/custom";
import { cityChannel } from "./tgChannels";

// Plain one-line link under the offers summary: daily cash rates of the city in Telegram.
// The click is recorded by the global ClickTracker through the data-track attributes.
const CityChannelLink = ({
  citySlug,
  cityName,
}: {
  citySlug?: string | null;
  cityName?: string | null;
}) => {
  const channel = cityChannel(citySlug);
  if (!channel) return null;
  return (
    <ResponsiveText size="sm" mt="3">
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
        <FaTelegramPlane />
        {`Курсы${cityName ? ` ${cityName}` : ""} каждый день в Telegram: @${channel}`}
      </ChakraLink>
    </ResponsiveText>
  );
};

export default CityChannelLink;
