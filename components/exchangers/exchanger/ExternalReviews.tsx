import React from "react";
import { Box, Link as ChakraLink, Tag } from "@chakra-ui/react";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { TitleH2 } from "../../shared/TitleH2";
import { IExternalReview, IExternalReviews, IExternalSource } from "../../../services/competitors";

// Visible at once; the rest sits in a native <details>.
const VISIBLE = 5;

// Manual thousands separator: Intl output differs between Node and browsers and would break hydration.
const num = (n: number | null | undefined) =>
  n == null ? "—" : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const date = (sec: number) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(sec * 1000));

const Stars = ({ rating }: { rating: number | null }) => {
  if (!rating) return null;
  return (
    <Box as="span" aria-label={`Оценка ${rating} из 5`} title={`${rating} из 5`} color={rating >= 4 ? "green.300" : rating === 3 ? "yellow.300" : "red.300"} letterSpacing="1px">
      {"★".repeat(rating)}
      <Box as="span" opacity={0.25}>
        {"★".repeat(5 - rating)}
      </Box>
    </Box>
  );
};

const ReviewItem = ({ r, sourceName }: { r: IExternalReview; sourceName: string }) => (
  <Box
    as="article"
    py="3"
    borderTopWidth="1px"
    borderColor="whiteAlpha.200"
    data-track-section="external-review"
  >
    <Box display="flex" flexWrap="wrap" alignItems="center" columnGap="3" rowGap="1" fontSize="sm">
      <Stars rating={r.rating} />
      <Box as="span" fontWeight="600">
        {r.author || "Аноним"}
      </Box>
      {r.country ? <Box as="span" opacity={0.6}>{r.country}</Box> : null}
      <Box as="span" opacity={0.6}>{date(r.postedAt)}</Box>
    </Box>
    <ResponsiveText mt="1" whiteSpace="pre-line" wordBreak="break-word" variant="contrast">
      {r.text}
    </ResponsiveText>
    {r.reply ? (
      <Box mt="2" pl="3" borderLeftWidth="2px" borderColor="whiteAlpha.300">
        <ResponsiveText size="xs" variant="no_contrast" whiteSpace="pre-line" wordBreak="break-word">
          {`${r.reply.author || "Ответ обменника"}: ${r.reply.text}`}
        </ResponsiveText>
      </Box>
    ) : null}
    <Box mt="1.5" fontSize="xs">
      <ChakraLink
        href={r.url}
        isExternal
        rel="nofollow noopener noreferrer"
        color="peach.300"
        data-track="external-review-source"
        data-track-label={sourceName}
      >
        {`Оригинал на ${sourceName} →`}
      </ChakraLink>
    </Box>
  </Box>
);

const SourceBlock = ({ s }: { s: IExternalSource }) => {
  const head = s.reviews.slice(0, VISIBLE);
  const tail = s.reviews.slice(VISIBLE);
  const { stats } = s;
  const facts = [
    stats.positive != null ? `положительных отзывов: ${num(stats.positive)}` : null,
    stats.negative != null && stats.negative > 0 ? `отрицательных: ${num(stats.negative)}` : null,
    stats.claimsClosed != null && stats.claimsClosed > 0 ? `закрытых финансовых претензий: ${num(stats.claimsClosed)}` : null,
    stats.claimsOpen != null && stats.claimsOpen > 0 ? `активных претензий: ${num(stats.claimsOpen)}` : null,
    stats.onSource ? `на ${s.name}: ${stats.onSource}` : null,
  ].filter(Boolean);

  return (
    <Box w="100%">
      <ResponsiveText variant="contrast" whiteSpace="unset">
        {`По данным ${s.name}${facts.length ? ": " + facts.join(", ") + "." : "."}`}
        {s.url ? (
          <>
            {" "}
            <ChakraLink
              href={s.url}
              isExternal
              rel="nofollow noopener noreferrer"
              color="peach.300"
              data-track="external-reviews-source"
              data-track-label={s.name}
            >
              {`Все отзывы на ${s.name} →`}
            </ChakraLink>
          </>
        ) : null}
      </ResponsiveText>

      {head.length ? (
        // Yandex <noindex>: copied third-party texts are shown to people, not offered to the index.
        React.createElement(
          "noindex",
          null,
          <Box data-nosnippet mt="3">
            {head.map((r) => (
              <ReviewItem key={r.id} r={r} sourceName={s.name} />
            ))}
            {tail.length ? (
              <Box as="details" mt="1">
                <Box as="summary" cursor="pointer" fontSize="sm" color="peach.300" py="2" _hover={{ textDecoration: "underline" }}>
                  {`Показать ещё ${tail.length}`}
                </Box>
                {tail.map((r) => (
                  <ReviewItem key={r.id} r={r} sourceName={s.name} />
                ))}
              </Box>
            ) : null}
          </Box>
        )
      ) : null}
    </Box>
  );
};

// Reviews written on another monitoring, copied with the author's name and a link to the original.
// Deliberately separate from our own reviews, no schema.org markup, not part of our rating.
const ExternalReviews = ({ data }: { data: IExternalReviews | null | undefined }) => {
  if (!data || !data.sources?.length) return null;
  const sources = data.sources.filter((s) => s.reviews.length > 0 || s.stats.positive != null);
  if (!sources.length) return null;
  const title = sources.length === 1 ? `Отзывы на ${sources[0]!.name}` : "Отзывы на других мониторингах";

  return (
    <BoxWrapper variant="no_contrast">
      <Box w="100%">
        <TitleH2 isLong={false}>
          <>{title}</>
        </TitleH2>
        {sources.map((s) => (
          <SourceBlock key={s.source} s={s} />
        ))}
        <ResponsiveText size="xs" variant="no_contrast" mt="3" whiteSpace="normal" wordBreak="break-word">
          {data.notice}
        </ResponsiveText>
      </Box>
    </BoxWrapper>
  );
};

export default ExternalReviews;
