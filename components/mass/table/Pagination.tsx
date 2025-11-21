// src/components/common/Pagination.tsx
import { HStack, Button } from "@chakra-ui/react";
import { useMemo } from "react";

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
  const pages = useMemo(() => {
    const pageItems: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      pageItems.push(1, 2, 3, 4, "ellipsis", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageItems.push(
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pageItems.push(
        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        totalPages
      );
    }

    return pageItems;
  }, [currentPage, totalPages]);

  return (
    <HStack justify="center" mt={4} spacing={2}>
      <Button
        size="sm"
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Назад
      </Button>

      {pages.map((page, index) => (
        typeof page === "number" ? (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? "solid" : "outline"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <Button
            key={`ellipsis-${index}`}
            size="sm"
            variant="ghost"
            isDisabled
            cursor="default"
          >
            ...
          </Button>
        )
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
