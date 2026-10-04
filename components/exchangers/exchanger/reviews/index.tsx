import React, { useCallback, useEffect, useRef, useState } from "react";
import { PiChatsFill } from "react-icons/pi";
import ExchangerRootReview from "./ExchangerRootReview";
import { IExchangerReview, IDotColors } from "../../../../types/exchanger";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { Button, Divider, HStack } from "@chakra-ui/react";

import ReviewsFilters from "./ReviewsFilters";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

const PAGE_SIZE = 10;

const filterTypeMap: Record<IDotColors, "positive" | "neutral" | "negative" | null> = {
  green: "positive",
  gray: "neutral",
  red: "negative",
  orange: null,
};

type Page = { items: IExchangerReview[]; total: number };

const loadPage = async (exchangerId: string, start: number, type: string | null): Promise<Page | null> => {
  try {
    const qs = new URLSearchParams({ id: exchangerId, start: String(start) });
    if (type) qs.set("type", type);
    const res = await fetch(`/api/exchanger-reviews?${qs.toString()}`);
    if (!res.ok) return null;
    return (await res.json()) as Page;
  } catch {
    return null;
  }
};

// Reviews of the exchanger from all sources (our users and copies from other monitorings), newest first.
// Only the first PAGE_SIZE come with the page; "Показать ещё" and the tone filters load more from the API.
export default function ExchangerReviews({
  exchangerId,
  initialReviews,
  initialTotal,
}: {
  exchangerId?: string | null;
  initialReviews?: IExchangerReview[] | null;
  initialTotal?: number | null;
}) {
  const [activeFilter, setActiveFilter] = useState<IDotColors | null>(null);
  const [items, setItems] = useState<IExchangerReview[]>(initialReviews ?? []);
  const [total, setTotal] = useState<number>(initialTotal ?? initialReviews?.length ?? 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const requestId = useRef(0);

  // Navigating between exchangers reuses the component: start over from the new page's data.
  useEffect(() => {
    setItems(initialReviews ?? []);
    setTotal(initialTotal ?? initialReviews?.length ?? 0);
    setActiveFilter(null);
    setError(false);
  }, [exchangerId, initialReviews, initialTotal]);

  const typeOf = (color: IDotColors | null) => (color ? filterTypeMap[color] : null);

  const handleToggleFilter = useCallback(
    async (color: IDotColors | null) => {
      const next = activeFilter === color ? null : color;
      setActiveFilter(next);
      setError(false);
      if (!next || !filterTypeMap[next]) {
        setItems(initialReviews ?? []);
        setTotal(initialTotal ?? initialReviews?.length ?? 0);
        return;
      }
      if (!exchangerId) return;
      const id = ++requestId.current;
      setBusy(true);
      const page = await loadPage(exchangerId, 0, filterTypeMap[next]);
      if (id !== requestId.current) return; // a newer click won
      setBusy(false);
      if (!page) return setError(true);
      setItems(page.items);
      setTotal(page.total);
    },
    [activeFilter, exchangerId, initialReviews, initialTotal]
  );

  const showMore = useCallback(async () => {
    if (!exchangerId || busy) return;
    setBusy(true);
    setError(false);
    const page = await loadPage(exchangerId, items.length, typeOf(activeFilter));
    setBusy(false);
    if (!page) return setError(true);
    setTotal(page.total);
    // Never show the same review twice if the list changed between requests.
    setItems((cur) => {
      const have = new Set(cur.map((r) => r.id));
      return [...cur, ...page.items.filter((r) => !have.has(r.id))];
    });
  }, [exchangerId, busy, items.length, activeFilter]);

  const hasAnyReviews = (initialTotal ?? initialReviews?.length ?? 0) > 0;
  const remaining = Math.max(0, total - items.length);

  return (
    <BoxWrapper variant="contrast">
      <HStack justifyContent="space-between">
        <CustomHeader text={`Отзывы (${total})`} Icon={PiChatsFill} />
        <ReviewsFilters toggleFilter={handleToggleFilter} activeFilter={activeFilter} />
      </HStack>
      <Divider my="4" />
      {items.some((r) => r.source) ? (
        <ResponsiveText size="xs" variant="no_contrast" whiteSpace="normal" mb="2">
          Отзывы с пометкой «Источник» скопированы с других мониторингов. Их написали не пользователи p2pie.
        </ResponsiveText>
      ) : null}
      {!hasAnyReviews ? (
        <ResponsiveText>Пока нет отзывов, оставьте отзыв первым</ResponsiveText>
      ) : items.length > 0 ? (
        items.map((review) => <ExchangerRootReview key={review.id} review={review} />)
      ) : busy ? null : (
        <ResponsiveText>Нет отзывов по выбранному фильтру</ResponsiveText>
      )}
      {error ? (
        <ResponsiveText size="sm" color="red.300" mt="2">
          Не удалось загрузить отзывы. Попробуйте ещё раз.
        </ResponsiveText>
      ) : null}
      {remaining > 0 ? (
        <Button
          mt="4"
          w="100%"
          variant="outline"
          onClick={showMore}
          isLoading={busy}
          loadingText="Загружаем…"
          data-track="reviews-show-more"
          data-track-label={`+${Math.min(PAGE_SIZE, remaining)}`}
        >
          {`Показать ещё ${Math.min(PAGE_SIZE, remaining)} из ${remaining}`}
        </Button>
      ) : null}
    </BoxWrapper>
  );
}
