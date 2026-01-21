import React from "react";
import useSWR from "swr";
import { initCurrencyConverterFetcher } from "../../../../../../services/fetchers";
import { ICurrencyConverterRate } from "../../../../../../types/shared";
import course from "next-seo/lib/jsonld/course";

export default function ({
  course,
  currencyPair,
}: {
  course?: number;
  currencyPair: string;
}) {
  const fetcher = initCurrencyConverterFetcher();
  const { data, error } = useSWR(
    currencyPair ? ["currency-converter", currencyPair] : null,
    () => fetcher(currencyPair),
  );
  // const rate = (data?.data as ICurrencyConverterRate | null) || undefined;
  // const displayCourse = rate?.currentRate ?? course;
  console.log(data);

  if (error) {
    return <div>course: {course ?? "-"}</div>;
  }

  return <div>course: {course ?? "-"}</div>;
}
