import { Heading } from "@chakra-ui/react";
import { t } from "i18next";
import React from "react";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../../types/selector";

export default function OtherHeaders({ text }: { text: string }) {
  return (
    <Heading
      as="h3"
      fontSize="lg"
      bgColor="bg.1000"
      borderTopRadius="lg"
      borderBottomRadius="none"
      boxShadow="lg"
      p="4"
      mt="0"
    >
      {text}
    </Heading>
  );
}

export const H3ForOthers = (mainPm: IPm, section: string) => {
  // Section-level headings to diversify wording from H4ForOthers
  const {
    ru_name,
    en_name,
    section: mainSection,
    currency,
    subgroup_name,
  } = mainPm;
  const fullName = capitalize(
    [ru_name || en_name, subgroup_name, currency?.code]
      .filter(Boolean)
      .join(" ")
  );

  const normalizedMain = (mainSection || "").toLowerCase();
  const normalizedSection = (section || "").toLowerCase();

  if (normalizedMain === "crypto") {
    if (normalizedSection === "bank") {
      return {
        buy: `Пополнить ${fullName} через банк`,
        sell: `Вывести ${fullName} через банк`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Обмен ${fullName} на криптовалюту`,
        sell: `Обмен криптовалюты на ${fullName} `,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Получить ${fullName} за наличные`,
        sell: `Отдать ${fullName} в наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `Пополнить ${fullName} переводом`,
        sell: `Вывести ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Пополнить ${fullName} через e‑кошельки`,
        sell: `Вывести ${fullName} на e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "bank") {
    if (normalizedSection === "bank") {
      return {
        buy: `Перевести на карту ${fullName}`,
        sell: `Перекинуть средства с ${fullName} на карту`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Пополнить крипту с ${fullName}`,
        sell: `Завести крипту на ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Снять наличные с ${fullName}`,
        sell: `Внести наличные на ${fullName}`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `Пополнить ${fullName} переводом`,
        sell: `Переслать перевод с ${fullName}`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Зачислить на ${fullName} из кошельков`,
        sell: `Вывести с ${fullName} в кошельки`,
      };
    }
  }

  if (normalizedMain === "cash") {
    if (normalizedSection === "bank") {
      return {
        buy: `Обмен ${fullName} на карту`,
        sell: `Пополнить карту наличными ${fullName}`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Купить криптовалюту за ${fullName}`,
        sell: `Обмен крипты в ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Обмен ${fullName} на другую валюту`,
        sell: `Выдать ${fullName} на другую валюту`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `Отправить перевод за ${fullName}`,
        sell: `Получить перевод в ${fullName}`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Внести ${fullName} в электронные кошельки`,
        sell: `Обналичить электронные деньги в ${fullName}`,
      };
    }
  }

  if (normalizedMain === "transfer") {
    if (normalizedSection === "bank") {
      return {
        buy: `Пополнить карту ${fullName} переводом`,
        sell: `Отправить перевод с карты ${fullName}`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Пополнить крипту переводом через ${fullName}`,
        sell: `Вывести крипту переводом через ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Получить наличные ${fullName} переводом`,
        sell: `Отправить ${fullName} наличными переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Пополнить e‑кошельки переводом через ${fullName}`,
        sell: `Вывести с e‑кошельков переводом через ${fullName}`,
      };
    }
  }

  if (normalizedMain === "digital") {
    if (normalizedSection === "bank") {
      return {
        buy: `Перевести на карту из кошелька ${fullName}`,
        sell: `Пополнить кошелек ${fullName} с карты`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Пополнить кошелек ${fullName} криптовалютой`,
        sell: `Вывести крипту через кошелек ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Обналичить средства кошелька ${fullName}`,
        sell: `Внести ${fullName} наличными в кошелек`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `Пополнить кошелек ${fullName} переводом`,
        sell: `Отправить перевод из кошелька ${fullName}`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Перевести между кошельками ${fullName}`,
        sell: `Обмен между кошельками ${fullName}`,
      };
    }
  }

  return {
    sell: "",
    buy: "",
  };
};

export const H4ForOthers = (mainPm: IPm, section: string) => {
  // possible sections: banks, crypto, transfer, digital, cash
  const {
    ru_name,
    en_name,
    section: mainSection,
    currency,
    subgroup_name,
  } = mainPm;
  const fullName = capitalize(
    [ru_name || en_name, subgroup_name].filter(Boolean).join(" ")
  );

  const buyVerb = t("main:toBuy", { defaultValue: "Купить" });
  const sellVerb = t("main:toSell", { defaultValue: "Продать" });

  const fallback = {
    buy: `${buyVerb} ${fullName}`.trim(),
    sell: `${sellVerb} ${fullName}`.trim(),
  };

  const normalizedMain = (mainSection || "").toLowerCase();
  const normalizedSection = (section || "").toLowerCase();

  if (normalizedMain === "crypto") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `Вывод ${fullName} на карту`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Конвертировать ${fullName}`,
        sell: `Конвертировать ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `Вывести ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `Вывести ${fullName} на электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "bank") {
    if (normalizedSection === "bank") {
      return {
        buy: `Пополнить ${fullName} с карты`,
        sell: `Перевести с ${fullName} на карту`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Вывод криптовалюты на ${fullName}`,
        sell: `${buyVerb} криптовалюту с ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Пополнить ${fullName} наличными`,
        sell: `Снять наличные с ${fullName}`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `Пополнить ${fullName} переводом`,
        sell: `Отправить перевод с ${fullName}`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Пополнить ${fullName} электронными деньгами`,
        sell: `Вывести с ${fullName} на электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "cash") {
    if (normalizedSection === "bank") {
      return {
        buy: `Снять ${fullName} с карты`,
        sell: `Положить ${fullName} на карту`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Вывести криптовалюту в ${fullName}`,
        sell: `${buyVerb} криптовалюту за ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName}`,
        sell: `${sellVerb} ${fullName}`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `Получить ${fullName} переводом`,
        sell: `Отправить перевод за ${fullName}`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Обналичить электронные деньги в ${fullName}`,
        sell: `Пополнить электронные кошельки за ${fullName}`,
      };
    }
  }

  if (normalizedMain === "transfer") {
    if (normalizedSection === "bank") {
      return {
        buy: `Получить ${fullName} на карту`,
        sell: `Оплатить ${fullName} с карты`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Вывод криптовалюты через ${fullName}`,
        sell: `${buyVerb} криптовалюту через ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Получить ${fullName} наличными`,
        sell: `Отправить ${fullName} наличными`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Получить ${fullName} на электронные кошельки`,
        sell: `Оплатить ${fullName} с электронных кошельков`,
      };
    }
  }

  if (normalizedMain === "digital") {
    if (normalizedSection === "bank") {
      return {
        buy: `Пополнить ${fullName} с карты`,
        sell: `Вывести ${fullName} на карту`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `Вывод криптовалюты на ${fullName}`,
        sell: `${buyVerb} криптовалюту за ${fullName}`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `Пополнить ${fullName} наличными`,
        sell: `Обналичить ${fullName}`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `Пополнить ${fullName} переводом`,
        sell: `Отправить ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `Перевести в ${fullName}`,
        sell: `Перевести из ${fullName}`,
      };
    }
  }

  return fallback;
};
