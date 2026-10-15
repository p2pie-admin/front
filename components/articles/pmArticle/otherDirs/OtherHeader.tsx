import { Heading } from "@chakra-ui/react";
import React from "react";
import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../../../types/selector";
import { Locale, pickName } from "../../../../services/i18n";

// English headings for the "other directions" blocks (one wording for H3 and H4; the Russian
// variants below differ only for SEO diversity).
const EN_SECTION_SUFFIX: Record<string, string> = {
  bank: " by card",
  crypto: " for crypto",
  cash: " for cash",
  transfer: " by transfer",
  digital: " via e-wallets",
};

const enOthers = (mainPm: IPm, section: string, withCurrency: boolean, emptyIfUnknown: boolean) => {
  const fullName = capitalize(
    [pickName(mainPm, "en"), mainPm.subgroup_name, withCurrency ? mainPm.currency?.code : ""]
      .filter(Boolean)
      .join(" ")
  );
  const main = (mainPm.section || "").toLowerCase();
  const sec = (section || "").toLowerCase();
  const knownMain = ["crypto", "bank", "cash", "transfer", "digital"].includes(main);
  let suffix: string | undefined = EN_SECTION_SUFFIX[sec];
  if (main === "cash" && sec === "cash") suffix = "";
  if (main === "digital" && sec === "digital") suffix = " in another wallet";
  if (main === "transfer" && sec === "transfer") suffix = undefined;
  if (!knownMain || suffix === undefined) {
    return emptyIfUnknown ? { sell: "", buy: "" } : { buy: `Buy ${fullName}`.trim(), sell: `Sell ${fullName}`.trim() };
  }
  return { buy: `Buy ${fullName}${suffix}`, sell: `Sell ${fullName}${suffix}` };
};

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

export const H3ForOthers = (mainPm: IPm, section: string, locale: Locale = "ru") => {
  if (locale === "en") return enOthers(mainPm, section, true, true);
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
  const buyVerb = "Купить";
  const sellVerb = "Продать";

  if (normalizedMain === "crypto") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} через банк`,
        sell: `${sellVerb} ${fullName} через банк`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "bank") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "cash") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "transfer") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "digital") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} в другом кошельке`,
        sell: `${sellVerb} ${fullName} в другом кошельке`,
      };
    }
  }

  return {
    sell: "",
    buy: "",
  };
};

export const H4ForOthers = (mainPm: IPm, section: string, locale: Locale = "ru") => {
  if (locale === "en") return enOthers(mainPm, section, false, false);
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

  const buyVerb = "Купить";
  const sellVerb = "Продать";

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
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "bank") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "cash") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "transfer") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "digital") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
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
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} в другом кошельке`,
        sell: `${sellVerb} ${fullName} в другом кошельке`,
      };
    }
  }

  return fallback;
};
