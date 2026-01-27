import React from "react";
import { Box3D } from "../../../../../styles/theme/custom";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsArrowRightShort } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { shallowEqual } from "react-redux";
import DirectionPmButton from "./directionPmButton";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import DeleteOffer from "./DeleteOffer";
import OfferCourse from "./course";
import OfferLimit from "./limit";
import { fetchP2POfferCourseRates } from "../../../../../redux/thunks";
import { powerOfTenOrder } from "../../../../../redux/amountsHelper";

type Props = {
  index: number;
  opened: number;
  setOpened: React.Dispatch<React.SetStateAction<number>>;
  handleExpand: (event: React.MouseEvent, index: number) => void;
};

const Offer = ({ index, opened, setOpened, handleExpand }: Props) => {
  const dispatch = useAppDispatch();
  const fullOffer = useAppSelector(
    (state) => state.main.p2pFullOffers[index],
    shallowEqual,
  );

  const givePm = fullOffer?.givePm;
  const getPm = fullOffer?.getPm;
  const currencyPair =
    givePm?.currency?.code && getPm?.currency?.code
      ? `${givePm.currency.code}_${getPm.currency.code}`.toUpperCase()
      : undefined;
  const dir =
    fullOffer.dir ||
    (givePm?.code && getPm?.code ? `${givePm.code}_${getPm.code}` : undefined);

  React.useEffect(() => {
    if (!dir && !currencyPair) return;
    dispatch(fetchP2POfferCourseRates({ index }));
  }, [dispatch, index, dir, currencyPair]);

  const dirExists = fullOffer.givePm && fullOffer.getPm;
  const side = fullOffer?.side === "get" ? "get" : "give";
  const toUSD = side === "give" ? fullOffer?.giveToUSD : fullOffer?.getToUSD;

  return (
    <Box3D
      id={`direction-item-${index}`}
      w="100%"
      flex="1"
      px="4"
      py="2"
      cursor="pointer"
      display="block"
      alignSelf="stretch"
      transition="filter 0.2s ease-in"
      _hover={{ filter: "brightness(1.1)" }}
      variant="extra_contrast"
      onClick={() => setOpened(index == opened ? 1000 : index)}
      //minH={fullHeight ? "70px" : "unset"}
    >
      <Grid
        gridTemplateColumns={"3fr 40px 3fr 2fr"}
        gridTemplateRows="auto"
        color="bg.500"
        alignItems="center"
        columnGap="2"
      >
        <DirectionPmButton
          side="give"
          directionIndex={index}
          pm={fullOffer?.givePm}
          handleExpand={handleExpand}
        />

        <BsArrowRightShort size="1.5rem" />

        <DirectionPmButton
          side="get"
          directionIndex={index}
          pm={fullOffer?.getPm}
          handleExpand={handleExpand}
        />
        <HStack justifySelf="end">
          {!!dirExists ? (
            <Button variant="ghost">
              {index == opened ? (
                <MdOutlineKeyboardArrowUp size="1.5rem" />
              ) : (
                <MdOutlineKeyboardArrowDown size="1.5rem" />
              )}
            </Button>
          ) : (
            <DeleteOffer index={index} />
          )}
        </HStack>
      </Grid>
      <Collapse in={index == opened && !!dirExists}>
        {/* <HStack> */}
        <VStack
          align="stretch"
          spacing="3"
          mt="3"
          onClick={(event) => event.stopPropagation()}
        >
          <Divider my="2" />
          <OfferCourse index={index} />

          <HStack w="fit-content" spacing="3" mt="2">
            <OfferLimit
              index={index}
              field="min"
              suggested={powerOfTenOrder((toUSD || 0) * 100)}
              fullOffer={fullOffer}
            />
            <Divider orientation="vertical" h="5" />
            <OfferLimit
              index={index}
              field="max"
              suggested={powerOfTenOrder((toUSD || 0) * 10000)}
              fullOffer={fullOffer}
            />
          </HStack>
          <HStack w="100%" justifyContent="space-between" mb="2">
            <Box />
            <DeleteOffer index={index} isFull />
          </HStack>
        </VStack>
        {/* <Box>
            <Chart giveCur={giveCur} getCur={getCur} noRate />
          </Box>
        </HStack> */}
        {/* <SimpleGrid columns={{ base: 1, md: 2 }} spacing="3">
            <FormControl>
              <FormLabel>Active</FormLabel>
              <Switch
                isChecked={Boolean(fullOffer?.isActive)}
                onChange={(e) => setField("isActive", e.target.checked)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Side</FormLabel>
              <Select
                value={fullOffer?.side || ""}
                onChange={(e) =>
                  setField(
                    "side",
                    (e.target.value || undefined) as IMakerOffer["side"],
                  )
                }
              >
                <option value="">-</option>
                <option value="give">give</option>
                <option value="get">get</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Course</FormLabel>
              <Input
                type="number"
                value={fullOffer?.course ?? ""}
                onChange={(e) =>
                  setField(
                    "course",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Min</FormLabel>
              <Input
                type="number"
                value={fullOffer?.min ?? ""}
                onChange={(e) =>
                  setField(
                    "min",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Max</FormLabel>
              <Input
                type="number"
                value={fullOffer?.max ?? ""}
                onChange={(e) =>
                  setField(
                    "max",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Fee Type</FormLabel>
              <Select
                value={fullOffer?.fee_type || ""}
                onChange={(e) =>
                  setField(
                    "fee_type",
                    (e.target.value || undefined) as IMakerOffer["fee_type"],
                  )
                }
              >
                <option value="">-</option>
                <option value="give">give</option>
                <option value="get">get</option>
                <option value="percentage">percentage</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Fee Amount</FormLabel>
              <Input
                type="number"
                value={fullOffer?.fee_amount ?? ""}
                onChange={(e) =>
                  setField(
                    "fee_amount",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>City From</FormLabel>
              <Input
                value={fullOffer?.city_from ?? ""}
                onChange={(e) => setField("city_from", e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>City To</FormLabel>
              <Input
                value={fullOffer?.city_to ?? ""}
                onChange={(e) => setField("city_to", e.target.value)}
              />
            </FormControl>
          </SimpleGrid> */}
      </Collapse>
    </Box3D>
  );
};

export default Offer;
