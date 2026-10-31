import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Box, Button, Code, Flex, Heading, Input, Link, Select, Text, VStack, useClipboard } from "@chakra-ui/react";

import { BoxWrapper } from "../../components/shared/BoxWrapper";
import CustomTitle from "../../components/shared/CustomTitle";
import UniversalSeo from "../../components/shared/UniversalSeo";
import { exchangerNameToSlug } from "../../components/exchangers/helper";
import { loadExchangers, TTL } from "../../cache/loadX";
import { IExchangerPreview } from "../../types/exchanger";
import { ISEO } from "../../types/general";
import { Locale, localeOf, tr, useT } from "../../services/i18n";

type Item = { slug: string; name: string };
const SIZES = [
  { key: "88x31", w: 88, h: 31 },
  { key: "150x50", w: 150, h: 50 },
  { key: "240x90", w: 240, h: 90 },
];
const SITE = "https://p2pie.com";

const snippet = (item: Item, size: (typeof SIZES)[number]) =>
  `<a href="${SITE}/exchangers/${item.slug}" target="_blank" title="${item.name}: отзывы и рейтинг на мониторинге p2pie">` +
  `<img src="${SITE}/badge/${item.slug}-${size.key}.svg" width="${size.w}" height="${size.h}" alt="${item.name} на мониторинге p2pie" style="border:0"></a>`;

const CodeBlock = ({ code }: { code: string }) => {
  const t = useT();
  const { hasCopied, onCopy, setValue } = useClipboard(code);
  useEffect(() => setValue(code), [code, setValue]);
  return (
    <Box w="100%">
      <Code display="block" whiteSpace="pre-wrap" wordBreak="break-all" p="3" borderRadius="md" fontSize="xs" w="100%">
        {code}
      </Code>
      <Button size="sm" mt="2" onClick={onCopy}>
        {hasCopied ? t("Скопировано", "Copied") : t("Скопировать код", "Copy code")}
      </Button>
    </Box>
  );
};

export default function BadgePage({ items, seo }: { items: Item[]; seo: ISEO }) {
  const t = useT();
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const ex = typeof router.query.ex === "string" ? router.query.ex.toLowerCase() : "";
    if (ex && items.some((i) => i.slug === ex)) setSlug(ex);
  }, [router.query.ex, items]);

  const shown = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return f ? items.filter((i) => i.name.toLowerCase().includes(f) || i.slug.includes(f)) : items;
  }, [filter, items]);
  const item = items.find((i) => i.slug === slug) || null;

  return (
    <>
      <UniversalSeo seo={seo} />
      <CustomTitle
        as="h1"
        title={t("Бейдж рейтинга для сайта обменника", "Rating badge for your exchanger website")}
        subtitle={t("Живой рейтинг p2pie у вас на сайте, бесплатно", "Your live p2pie rating on your website, free")}
        my="12"
      />
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
          <VStack align="stretch" spacing="3">
            <Text color="bg.200">
              {t(
                "Бейдж показывает то же, что видит любой посетитель вашей страницы в мониторинге: оценку, число отзывов и площадки, с которых мы их собираем (BestChange, KursExpert и другие). Картинка обновляется сама раз в час. Ссылка ведёт на страницу вашего обменника, а не на таблицу курсов с конкурентами.",
                "The badge shows what any visitor of your monitoring page sees: the score, the number of reviews and the platforms we collect them from (BestChange, KursExpert and others). The image refreshes itself every hour. The link leads to your exchanger's page, not to a rate table with competitors.",
              )}
            </Text>
            <Flex gap="3" flexDir={{ base: "column", md: "row" }}>
              <Input placeholder={t("Найти обменник", "Find your exchanger")} value={filter} onChange={(e) => setFilter(e.target.value)} />
              <Select placeholder={t("Выберите обменник", "Choose your exchanger")} value={slug} onChange={(e) => setSlug(e.target.value)}>
                {shown.map((i) => (
                  <option key={i.slug} value={i.slug}>
                    {i.name}
                  </option>
                ))}
              </Select>
            </Flex>
          </VStack>
        </BoxWrapper>

        {item && (
          <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
            <VStack align="stretch" spacing="6">
              {SIZES.map((size) => (
                <Box key={size.key}>
                  <Heading as="h2" size="sm" color="bg.100" mb="3">
                    {size.key}
                  </Heading>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/badge/${item.slug}-${size.key}.svg`} width={size.w} height={size.h} alt={item.name} />
                  <Box mt="3">
                    <CodeBlock code={snippet(item, size)} />
                  </Box>
                </Box>
              ))}
              <Text color="bg.300" fontSize="sm">
                {t(
                  "Атрибут rel у ссылки оставляем на ваше усмотрение. Если бейдж не подходит по стилю, можно поставить обычную текстовую ссылку на вашу страницу:",
                  "The link's rel attribute is up to you. If the badge does not fit your design, a plain text link to your page works too:",
                )}
              </Text>
              <CodeBlock code={`<a href="${SITE}/exchangers/${item.slug}" target="_blank">${item.name} на p2pie</a>`} />
              <Text color="bg.300" fontSize="sm">
                {t("Страница обменника:", "Exchanger page:")}{" "}
                <Link as={NextLink} href={`/exchangers/${item.slug}`} color="blue.300">
                  p2pie.com/exchangers/{item.slug}
                </Link>
                .{" "}
                {t(
                  "Напишите на support@p2pie.com, когда поставите бейдж, и мы отметим обменник как партнёра p2pie.",
                  "Write to support@p2pie.com once the badge is up and we will mark the exchanger as a p2pie partner.",
                )}
              </Text>
            </VStack>
          </BoxWrapper>
        )}
      </VStack>
    </>
  );
}

const buildSeo = (locale: Locale): ISEO => ({
  title: tr(locale, "Бейдж рейтинга p2pie для сайта обменника", "p2pie rating badge for exchanger websites"),
  description: tr(
    locale,
    "Бесплатный бейдж с живым рейтингом обменника: оценка, число отзывов с BestChange, KursExpert и других мониторингов. Код для сайта в трёх размерах.",
    "A free badge with the exchanger's live rating: score and number of reviews from BestChange, KursExpert and other monitorings. Website code in three sizes.",
  ),
  canonicalSlug: "for-exchangers/badge",
});

export async function getStaticProps(ctx: { locale?: string }) {
  const locale = localeOf(ctx);
  const list = ((await loadExchangers().catch(() => [])) || []) as IExchangerPreview[];
  const items: Item[] = list
    .filter((e) => e?.name)
    .map((e) => ({ slug: exchangerNameToSlug(e.name), name: e.display_name || e.name }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  return { props: { items, seo: buildSeo(locale) }, revalidate: TTL.slow };
}
