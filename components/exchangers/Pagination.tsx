// components/Pagination.tsx
import { Button, HStack, Text } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const maxVisibleButtons = 5; // Fixed number of visible page buttons
  let pageNumbers: (number | string)[] = [];

  if (totalPages <= maxVisibleButtons) {
    // Show all pages if total pages fit within the max buttons
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    pageNumbers.push(1); // Always show the first page

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = 4;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    if (start > 2) pageNumbers.push("...");
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    if (end < totalPages - 1) pageNumbers.push("...");

    pageNumbers.push(totalPages); // Always show the last page
  }

  return (
    <HStack mt={4} justify="space-between" w="100%">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      >
        Previous
      </Button>

      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            onClick={() => onPageChange(page)}
            colorScheme={currentPage === page ? "blue" : "gray"}
          >
            {page}
          </Button>
        ) : (
          <Text key={index} px={2} fontWeight="bold">
            ...
          </Text>
        )
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;
