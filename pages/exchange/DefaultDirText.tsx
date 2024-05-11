import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { ResponsiveText } from "../../styles/theme/custom";

const DefaultDirText = ({ slug }: { slug?: string }) => {
  if (!slug) return <></>;
  const dirTitle = String(
    slug.split("-").map((word) => (word === "to" ? "→" : capitalize(word)))
  ).replaceAll(",", " ");
  return (
    <>
      <ResponsiveText>
        {`Сперва превращаем ссылку exchange/${slug} в читабельный заголовок:`}{" "}
      </ResponsiveText>
      <ResponsiveText size="xl" fontWeight="bold">
        {`Обмен по направлению ${dirTitle}`}
      </ResponsiveText>
      <ResponsiveText> Далее фигачим авто-описание для SEO </ResponsiveText>
      <ResponsiveText>
        Затем грузим сгенеренный через chatGPT или вручную написанный текст из
        админки, если таковой имеется :
      </ResponsiveText>
    </>
  );
};

export default DefaultDirText;
