import React from "react";
import { Box } from "@chakra-ui/react";
import OutLink from "../../shared/OutLink";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { TitleH2 } from "../../shared/TitleH2";
import { IExternalReviews } from "../../../services/competitors";
import { useT } from "../../../services/i18n";

// Manual thousands separator: Intl output differs between Node and browsers and would break hydration.
const num = (n: number | null | undefined) =>
  n == null ? "—" : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Counters other monitorings show for this exchanger (with a link to them). The reviews themselves
// are stored in our own reviews list, each tagged with its source.
const ExternalReviews = ({ data }: { data: IExternalReviews | null | undefined }) => {
  const t = useT();
  if (!data || !data.sources?.length) return null;
  const sources = data.sources.filter((s) => s.stats.positive != null || s.stats.reviewsTotal != null);
  if (!sources.length) return null;

  return (
    <BoxWrapper variant="no_contrast">
      <Box w="100%">
        <TitleH2 isLong={false}>
          <>{sources.length === 1 ? `${t("Отзывы на", "Reviews on")} ${sources[0]!.name}` : t("Отзывы на других мониторингах", "Reviews on other monitorings")}</>
        </TitleH2>
        {sources.map((s) => {
          const { stats } = s;
          const facts = [
            stats.positive != null ? `${t("положительных отзывов", "positive reviews")}: ${num(stats.positive)}` : null,
            stats.negative != null && stats.negative > 0 ? `${t("отрицательных", "negative")}: ${num(stats.negative)}` : null,
            stats.claimsClosed != null && stats.claimsClosed > 0 ? `${t("закрытых финансовых претензий", "closed financial claims")}: ${num(stats.claimsClosed)}` : null,
            stats.claimsOpen != null && stats.claimsOpen > 0 ? `${t("активных претензий", "open claims")}: ${num(stats.claimsOpen)}` : null,
            stats.onSource ? `${t("на", "on")} ${s.name}: ${stats.onSource}` : null,
          ].filter(Boolean);
          return (
            <ResponsiveText key={s.source} variant="contrast" whiteSpace="unset" mt="1">
              {`${t("По данным", "According to")} ${s.name}${facts.length ? ": " + facts.join(", ") + "." : "."}`}
              {s.url ? (
                <>
                  {" "}
                  <OutLink
                    href={s.url}
                    color="peach.300"
                    data-track="external-reviews-source"
                    data-track-label={s.name}
                  >
                    {`${t("Все отзывы на", "All reviews on")} ${s.name} →`}
                  </OutLink>
                </>
              ) : null}
            </ResponsiveText>
          );
        })}
      </Box>
    </BoxWrapper>
  );
};

export default ExternalReviews;
