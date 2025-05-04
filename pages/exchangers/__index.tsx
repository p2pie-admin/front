// pages/exchangers.tsx
import { useState } from "react";
import { Box, Text, Grid } from "@chakra-ui/react";
import Pagination from "../../components/exchangers/Pagination";

interface Exchanger {
  id: number;
  name: string;
  rate: string;
}

const exchangers: Exchanger[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Exchanger ${index + 1}`,
  rate: `Rate ${Math.random().toFixed(2)}`,
}));

const ExchangersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(exchangers.length / pageSize);

  const currentExchangers = exchangers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Box>
      {currentExchangers.map((exchanger) => (
        <Box key={exchanger.id} p={4} borderWidth={1} borderRadius="md">
          <Text fontWeight="bold">{exchanger.name}</Text>
          <Text>{exchanger.rate}</Text>
        </Box>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default ExchangersPage;
