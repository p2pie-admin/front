import React from "react";
import { Box } from "@chakra-ui/react";
import OutLink from "../../shared/OutLink";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { TitleH2 } from "../../shared/TitleH2";
import { IExternalReviews } from "../../../services/competitors";

// Manual thousands separator: Intl output differs between Node and browsers and would break hydration.
const num = (n: number | null | undefined) =>
  n == null ? "—" : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Counters other monitorings show for this exchanger (with a link to them). The reviews themselves
// are stored in our own reviews list, each tagged with its source.
const ExternalReviews = ({ data }: { data: IExternalReviews | null | undefined }) => {
  if (!data || !data.sources?.length) return null;
  const sources = data.sources.filter((s) => s.stats.positive != null || s.stats.reviewsTotal != null);
  if (!sources.length) return null;

  return (
    <BoxWrapper variant="no_contrast">
      <Box w="100%">
        <TitleH2 isLong={false}>
          <>{sources.length === 1 ? `Отзывы на ${sources[0]!.name}` : "Отзывы на других мониторингах"}</>
        </TitleH2>
        {sources.map((s) => {
          const { stats } = s;
          const facts = [
            stats.positive != null ? `положительных отзывов: ${num(stats.positive)}` : null,
            stats.negative != null && stats.negative > 0 ? `отрицательных: ${num(stats.negative)}` : null,
            stats.claimsClosed != null && stats.claimsClosed > 0 ? `закрытых финансовых претензий: ${num(stats.claimsClosed)}` : null,
            stats.claimsOpen != null && stats.claimsOpen > 0 ? `активных претензий: ${num(stats.claimsOpen)}` : null,
            stats.onSource ? `на ${s.name}: ${stats.onSource}` : null,
          ].filter(Boolean);
          return (
            <ResponsiveText key={s.source} variant="contrast" whiteSpace="unset" mt="1">
              {`По данным ${s.name}${facts.length ? ": " + facts.join(", ") + "." : "."}`}
              {s.url ? (
                <>
                  {" "}
                  <OutLink
                    href={s.url}
                    color="peach.300"
                    data-track="external-reviews-source"
                    data-track-label={s.name}
                  >
                    {`Все отзывы на ${s.name} →`}
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
