// src/components/common/Pagination.tsx
import { HStack, Button } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <HStack justify="center" mt={4} spacing={2}>
      <Button
        size="sm"
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Назад
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? "solid" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        size="sm"
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Далее
      </Button>
    </HStack>
  );
}
