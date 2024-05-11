import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { ResponsiveText } from "../../styles/theme/custom";
import { Text } from "@chakra-ui/react";

const DefaultDirText = ({ slug }: { slug?: string }) => {
  if (!slug) return <></>;
  const dirTitle = String(
    slug.split("-").map((word) => (word === "to" ? "→" : capitalize(word)))
  ).replaceAll(",", " ");
  return (
    <>
      <Text>
        Все, что ты здесь видишь, грузится без JS и полностью читабельно для
        поисковиков
      </Text>
      <Text>
        Можешь вбить в конец любую существующую пару и прилетит в ответ
        мгновенный html. Например: tinkoff-rub-to-tether-usdt-trc20
      </Text>

      <Text>
        {`Сперва превращаем ссылку exchange/${slug} в читабельный заголовок:`}{" "}
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {`Обмен по направлению ${dirTitle}`}
      </Text>
      <Text> Далее фигачим авто-описание для SEO </Text>

      <Text>
        Затем грузим сгенеренный через chatGPT или вручную написанный текст из
        админки, если таковой имеется.. Все h1 h2 расставляются автоматом :
      </Text>
    </>
  );
};

export default DefaultDirText;
