import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { buildRateString } from "../shared/helper";
import { formatAmount, formatMoscowTime, IRatesSummary } from "./ssrRates";

const pmName = (pm: IPm) => capitalize(pm.ru_name || pm.en_name);

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
};

// Three steps and a short FAQ built from the live numbers of this direction. The answers
// differ per direction (counts, rates, limits), so the block is not boilerplate, and the
// same content is exposed as HowTo + FAQPage JSON-LD. No time-of-render strings except
// the Moscow-fixed timestamp of the freshest offer (identical on server and client).
const HowToAndFaq = ({
  summary,
  total,
  giveCur,
  getCur,
  givePm,
  getPm,
}: {
  summary: IRatesSummary | null | undefined;
  total?: number | null;
  giveCur: string;
  getCur: string;
  givePm: IPm;
  getPm: IPm;
}) => {
  const give = pmName(givePm);
  const get = pmName(getPm);
  const count = summary?.count || total || 0;
  if (!count) return null;

  const best = summary ? buildRateString({ course: summary.bestCourse, giveCur, getCur }) : "";
  const median = summary ? buildRateString({ course: summary.medianCourse, giveCur, getCur }) : "";
  const when = summary ? formatMoscowTime(summary.updatedAt) : null;
  const smallCur = summary && summary.bestCourse > 1 ? giveCur : getCur;
  const minAmount = summary?.minAmount ? formatAmount(summary.minAmount, smallCur) : null;
  const spread = summary ? summary.spreadPercent.toFixed(1) : null;

  const steps = [
    {
      name: `Выберите обменник в таблице`,
      text: `Предложения отсортированы по курсу: лучший — первым. Смотрите на рейтинг, резерв и лимиты: суммы вне лимитов обменник не примет.`,
    },
    {
      name: `Перейдите на сайт обменника и создайте заявку`,
      text: `Нажмите «Перейти», укажите сумму и реквизиты получения. Курс фиксируется по правилам обменника — обычно на 10–30 минут после создания заявки.`,
    },
    {
      name: `Отправьте ${give} и получите ${get}`,
      text: `После подтверждения вашего перевода обменник отправляет средства. Если что-то пошло не так, оставьте отзыв на странице обменника — мы передадим его команде обменника.`,
    },
  ];

  const faq: { q: string; a: string }[] = [];
  faq.push({
    q: `Сколько обменников меняют ${give} на ${get}?`,
    a: `${when ? `На ${when} (МСК)` : "Сейчас"} по направлению доступно ${count} ${plural(
      count,
      "предложение",
      "предложения",
      "предложений",
    )}${best ? `. Лучший курс — ${best}` : ""}${
      median && count > 1 ? `, медианный — ${median}` : ""
    }. Список обновляется автоматически по XML-выгрузкам обменников.`,
  });
  if (minAmount) {
    faq.push({
      q: `Какая минимальная сумма обмена ${give} → ${get}?`,
      a: `Самый низкий порог среди текущих предложений — от ${minAmount}. У каждого обменника свой лимит, он указан в строке таблицы; максимальная сумма ограничена резервом обменника.`,
    });
  }
  faq.push({
    q: `Почему курс обменников отличается от биржевого?`,
    a: `Обменник закладывает в курс свою комиссию, стоимость ликвидности и риск. Поэтому предложения различаются между собой${
      spread && count > 1 ? `: сейчас разброс между лучшим и худшим курсом — ${spread} %` : ""
    }. Сравнивать выгодно именно итоговую сумму к получению, а не заявленную комиссию.`,
  });
  faq.push({
    q: `Как p2pie отбирает обменники?`,
    a: `В мониторинг попадают обменники с рабочей XML-выгрузкой курсов и проверенной доступностью. Мы ведём историю курсов и аптайма, публикуем отзывы с указанием источника. Обменники, которых нет в известных мониторингах, проходят проверку с тестовыми покупками.`,
  });

  const site = `https://${process.env.NEXT_PUBLIC_NAME}.com`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: `Как обменять ${give} на ${get}`,
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <Box mt="6" mb="2" px="2">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </Head>
      <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} color="bg.100" mb="3">
        {`Как обменять ${give} на ${get}`}
      </Heading>
      <OrderedList spacing="2" color="bg.200" pl="1">
        {steps.map((s) => (
          <ListItem key={s.name}>
            <Text as="span" fontWeight="600" color="bg.100">
              {s.name}.
            </Text>{" "}
            <Text as="span" color="bg.300">
              {s.text}
            </Text>
          </ListItem>
        ))}
      </OrderedList>

      <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} color="bg.100" mt="6" mb="2">
        Вопросы и ответы
      </Heading>
      <Accordion allowMultiple defaultIndex={[0]}>
        {faq.map((f) => (
          <AccordionItem key={f.q} border="none" borderRadius="lg" bgColor="rgba(255,255,255,0.03)" mb="2">
            <AccordionButton px="3" py="3" color="bg.200" _expanded={{ color: "peach.200" }}>
              <Box as="h3" flex="1" textAlign="left" fontWeight="600" fontSize="md">
                {f.q}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="3" pb="4" color="bg.300">
              {f.a}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Text fontSize="xs" color="bg.500" mt="2">
        {site.replace("https://", "")} не проводит обмен: сделка происходит на сайте выбранного обменника.
      </Text>
    </Box>
  );
};

export default HowToAndFaq;
