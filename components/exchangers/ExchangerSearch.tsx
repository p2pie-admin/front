import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

interface ExchangerSearchProps {
  onSearch: (query: string) => void;
}

const ExchangerSearch: React.FC<ExchangerSearchProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  useEffect(() => {
    onSearch(debouncedValue.trim().toLowerCase());
  }, [debouncedValue, onSearch]);

  return (
    <Input
      placeholder={t("Search exchangers by name...")}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      borderWidth="2px"
      borderRadius="xl"
      borderColor="bg.500"
      size="md"
      h="45px"
      focusBorderColor="peach.200"
    />
  );
};

export default ExchangerSearch;
