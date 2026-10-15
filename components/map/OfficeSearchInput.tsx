import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { MdOutlineClear } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import { useT } from "../../services/i18n";

type OfficeSearchInputProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
};

const OfficeSearchInput = ({
  value,
  onChange,
  placeholder,
}: OfficeSearchInputProps) => {
  const t = useT();
  placeholder = placeholder ?? t("Поиск офиса", "Search offices");
  const isEmptyInput = value.trim().length === 0;

  return (
    <InputGroup maxW={{ lg: "320px", base: "100%" }}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="filled"
        borderWidth="2px"
        borderRadius="xl"
        borderColor="bg.500"
        focusBorderColor="peach.200"
        _hover={{ bg: "bg.800" }}
        pr="3rem"
      />
      <InputRightElement width="2.5rem">
        <IconButton
          aria-label={isEmptyInput ? "search" : "clear"}
          size="sm"
          variant="ghost"
          color="bg.200"
          _hover={{ color: "peach.200" }}
          icon={
            isEmptyInput ? (
              <RiSearchLine size="1rem" />
            ) : (
              <MdOutlineClear size="1rem" />
            )
          }
          onClick={() => {
            if (!isEmptyInput) {
              onChange("");
            }
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default OfficeSearchInput;
