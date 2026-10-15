import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useT } from "../../services/i18n";

interface ExchangerSearchProps {
  onSearch: (query: string) => void;
}

const ExchangerSearch: React.FC<ExchangerSearchProps> = ({ onSearch }) => {
  const t = useT();
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
      placeholder={t("Поиск по имени...", "Search by name...")}
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
