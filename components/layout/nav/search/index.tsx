"use client";

import { useRef, useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  useOutsideClick,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiX } from "react-icons/bi";
import useSWR from "swr";
import NavButton from "../NavButton";
import { Box3D } from "../../../../styles/theme/custom";
import { useRouter } from "next/router";
import { filterSearchResults } from "./helper";
import Transliterator from "../../../../services/transliterator";
const transliterator = new Transliterator();

const MotionBox = motion(Box);
const MotionInputGroup = motion(InputGroup);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

const SearchAll = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const color = useColorModeValue("violet.700", "peach.300");
  const locale = process.env.NEXT_PUBLIC_SITE_LANG || "ru";

  const { data, error } = useSWR(open ? "/api/search-index" : null, fetcher, {
    revalidateOnFocus: false,
  });

  const isLoading = !data && !error;
  const entries = data?.data || [];

  let results = filterSearchResults(entries, value).slice(0, 10);

  if (results.length === 0 && value.trim()) {
    // fallback: try transliterated matches
    results = entries
      .filter((e: any) =>
        transliterator.findMatch(e.header, value.toLowerCase())
      )
      .slice(0, 10);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setMenuVisible(false);
    setOpen(false);
    setTimeout(() => {
      setValue("");
    }, 300); // wait for width animation
  };

  // close on outside click
  useOutsideClick({
    ref,
    handler: handleClose,
  });

  // update position for fixed menu
  useEffect(() => {
    if (ref.current) {
      const updatePosition = () => {
        setInputRect(ref.current!.getBoundingClientRect());
      };
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, []);

  // show menu after expand done
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => setMenuVisible(true), 350);
      return () => clearTimeout(timeout);
    } else {
      setMenuVisible(false);
    }
  }, [open]);

  return (
    <>
      <Box
        ref={ref}
        position="relative"
        display="flex"
        alignItems="center"
        zIndex={100}
      >
        <AnimatePresence initial={false}>
          {!open ? (
            <MotionBox
              key="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
            >
              <NavButton handleClick={handleOpen} icon={BiSearch} />
            </MotionBox>
          ) : (
            <MotionBox
              boxShadow="none !important"
              key="input"
              initial={{ width: 48, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 48, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <Box3D
                w="100%"
                boxShadow="lg"
                borderRadius="xl"
                variant="contrast"
              >
                <MotionInputGroup size="sm" borderRadius="2xl">
                  <Input
                    h="10"
                    color={color}
                    border="none"
                    placeholder="Поиск направления или обменника"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                    _placeholder={{ color: "bg.500" }}
                  />
                  <InputRightElement borderRadius="50%">
                    <IconButton
                      mt="2"
                      aria-label="Close search"
                      icon={<BiX />}
                      variant="ghost"
                      size="lg"
                      borderRadius="50%"
                      onClick={handleClose}
                    />
                  </InputRightElement>
                </MotionInputGroup>
              </Box3D>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>

      {/* Fixed dropdown anchored to input position */}
      <AnimatePresence>
        {menuVisible && value && inputRect && (
          <MotionBox
            key="menu"
            position="fixed"
            top={`${inputRect.bottom + 8}px`}
            right={`560px`}
            w="360px"
            bgColor="bg.800"
            borderRadius="md"
            boxShadow="lg"
            maxH="200px"
            overflowY="auto"
            p="2"
            zIndex="1500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {isLoading ? (
              <Box textAlign="center" py="4">
                <Spinner size="sm" />
              </Box>
            ) : results.length > 0 ? (
              results.map((r: any) => (
                <Box
                  key={r.slug}
                  p="2"
                  bgColor="bg.800"
                  borderRadius="md"
                  _hover={{ bg: "bg.900", cursor: "pointer" }}
                  onClick={() => {
                    console.log("Selected slug:", r.slug);
                    router.push(r.slug);
                    handleClose();
                  }}
                >
                  <Tooltip
                    hasArrow
                    bg={"bg.500"}
                    placement="top"
                    size="sm"
                    fontSize="sm"
                    label={r.header}
                    color="bg.100"
                  >
                    {" "}
                    {r.header.length > 32
                      ? r.header.slice(0, 32) + "..."
                      : r.header}
                  </Tooltip>
                </Box>
              ))
            ) : (
              <Box textAlign="center" py="2" color="bg.500">
                Ничего не найдено
              </Box>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchAll;
