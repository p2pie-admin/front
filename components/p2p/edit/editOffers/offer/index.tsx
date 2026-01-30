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
  GridItem,
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
import { batch, shallowEqual } from "react-redux";
import DirectionPmButton from "./directionPmButton";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import DeleteOffer from "./DeleteOffer";
import OfferCourse from "./course";
import OfferLimit from "./limit";
import { fetchP2POfferCourseRates } from "../../../../../redux/thunks";
import {
  setP2PDirectionPm,
  setP2PFullOfferField,
} from "../../../../../redux/mainReducer";
import { powerOfTenOrder } from "../../../../../redux/amountsHelper";
import { IFullOffer, IMakerOffer } from "../../../../../types/p2p";
import OfferLimitSlider from "./OfferLimitSlider";
import Chart from "../../../../exchange/Chart";

type Props = {
  index: number;
  opened: number;
  setOpened: React.Dispatch<React.SetStateAction<number>>;
  handleExpand: (event: React.MouseEvent, index: number) => void;
  initialOffer?: Partial<IFullOffer>;
};

const Offer = ({
  index,
  opened,
  setOpened,
  handleExpand,
  initialOffer,
}: Props) => {
  const dispatch = useAppDispatch();
  const storeOffer = useAppSelector(
    (state) => state.main.p2pFullOffers[index],
    shallowEqual,
  );
  const fullOffer = React.useMemo(
    () => ({
      ...(initialOffer || {}),
      ...(storeOffer || {}),
    }),
    [initialOffer, storeOffer],
  );

  React.useEffect(() => {
    if (!initialOffer) return;
    if (storeOffer && Object.keys(storeOffer).length) return;
    batch(() => {
      const seedFields: Array<{
        field: keyof Omit<IMakerOffer, "id" | "dir">;
        value: IMakerOffer[keyof IMakerOffer] | null | undefined;
      }> = [
        { field: "side", value: initialOffer.side },
        { field: "isActive", value: initialOffer.isActive },
        { field: "course", value: initialOffer.course },
        { field: "min", value: initialOffer.min },
        { field: "max", value: initialOffer.max },
        { field: "fee_type", value: initialOffer.fee_type },
        { field: "fee_amount", value: initialOffer.fee_amount },
        { field: "city_from", value: initialOffer.city_from },
        { field: "city_to", value: initialOffer.city_to },
      ];
      seedFields.forEach(({ field, value }) => {
        if (value === undefined) return;
        dispatch(setP2PFullOfferField({ index, field, value }));
      });
      if (initialOffer.givePm) {
        dispatch(
          setP2PDirectionPm({ index, side: "give", pm: initialOffer.givePm }),
        );
      }
      if (initialOffer.getPm) {
        dispatch(
          setP2PDirectionPm({ index, side: "get", pm: initialOffer.getPm }),
        );
      }
    });
  }, [dispatch, index, initialOffer, storeOffer]);

  const givePm = fullOffer?.givePm;
  const getPm = fullOffer?.getPm;
  const currencyPair =
    givePm?.currency?.code && getPm?.currency?.code
      ? `${givePm.currency.code}_${getPm.currency.code}`.toUpperCase()
      : undefined;
  const dir =
    fullOffer.dir ||
    (givePm?.code && getPm?.code ? `${givePm.code}_${getPm.code}` : undefined);

  const prevSideRef = React.useRef<typeof fullOffer.side>(fullOffer?.side);
  React.useEffect(() => {
    const prevSide = prevSideRef.current;
    const currentSide = fullOffer?.side;
    if (!currentSide || !prevSide || currentSide === prevSide) {
      prevSideRef.current = currentSide;
      return;
    }
    const course = fullOffer?.course;
    if (!course || !Number.isFinite(course) || course <= 0) {
      prevSideRef.current = currentSide;
      return;
    }
    const convertValue = (value?: number | null) => {
      if (value === null || value === undefined) return value;
      if (!Number.isFinite(value)) return value;
      return currentSide === "get" ? value / course : value * course;
    };
    const normalizeLimit = (value?: number | null, kind?: "min" | "max") => {
      if (value === null || value === undefined) return value;
      if (!Number.isFinite(value)) return value;
      const order = powerOfTenOrder(value);
      if (!order) return value;
      return kind === "max" ? order * 10 : order;
    };
    const nextMin = normalizeLimit(convertValue(fullOffer?.min), "min");
    const nextMax = normalizeLimit(convertValue(fullOffer?.max), "max");
    if (nextMin !== undefined) {
      dispatch(setP2PFullOfferField({ index, field: "min", value: nextMin }));
    }
    if (nextMax !== undefined) {
      dispatch(setP2PFullOfferField({ index, field: "max", value: nextMax }));
    }
    prevSideRef.current = currentSide;
  }, [
    dispatch,
    fullOffer?.course,
    fullOffer?.max,
    fullOffer?.min,
    fullOffer?.side,
    index,
  ]);

  React.useEffect(() => {
    if (!dir && !currencyPair) return;
    dispatch(fetchP2POfferCourseRates({ index }));
  }, [dispatch, index, dir, currencyPair]);

  const dirExists = fullOffer.givePm && fullOffer.getPm;
  const side = fullOffer?.side === "get" ? "get" : "give";
  const toUSD = side === "give" ? fullOffer?.giveToUSD : fullOffer?.getToUSD;
  const suggestedMin = powerOfTenOrder((toUSD || 0) * 500);
  const suggestedMax = powerOfTenOrder((toUSD || 0) * 2000);
  const suggestedMinPossible = powerOfTenOrder((toUSD || 0) * 100);
  const sliderMin =
    Number.isFinite(fullOffer?.min) && fullOffer?.min !== null
      ? fullOffer.min
      : suggestedMin;
  const sliderMax =
    Number.isFinite(fullOffer?.max) && fullOffer?.max !== null
      ? fullOffer.max
      : suggestedMax;
  const sliderMinSeed =
    sliderMin && Number.isFinite(sliderMin) && sliderMin > 0
      ? sliderMin
      : sliderMax && Number.isFinite(sliderMax) && sliderMax > 0
        ? sliderMax
        : 0;
  const sliderMinPossible =
    suggestedMinPossible > 0
      ? suggestedMinPossible
      : powerOfTenOrder(sliderMinSeed);

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
        <Divider my="2" />
        <Grid
          columnGap="8"
          mt="4"
          onClick={(event) => event.stopPropagation()}
          templateColumns=" 1fr auto"
          templateRows="auto auto"
        >
          {/* Left top */}

          <OfferCourse index={index} />
          {/* Right (double height) */}

          <GridItem rowSpan={2}>
            <HStack gap="4" alignItems="center">
              <Divider orientation="vertical" h="140px" mb="4" />
              <Chart
                giveCur={givePm?.currency.code.toUpperCase()}
                getCur={getPm?.currency.code.toUpperCase()}
                noRate
                //currentRateOverride={googleRate}
              />
            </HStack>
          </GridItem>
          <Box w="100%" mx="2">
            <HStack w="fit-content" spacing="3" my="2">
              <OfferLimit
                index={index}
                field="min"
                suggested={suggestedMin}
                fullOffer={fullOffer}
              />
              <Divider orientation="vertical" h="5" />
              <OfferLimit
                index={index}
                field="max"
                suggested={suggestedMax}
                fullOffer={fullOffer}
              />
            </HStack>
            <OfferLimitSlider
              index={index}
              min={sliderMin}
              max={sliderMax}
              minPossible={sliderMinPossible}
            />
          </Box>
          {/* Left bottom */}
        </Grid>
        {/* <HStack w="100%" justifyContent="space-between" mb="2">
          <Box />
          <DeleteOffer index={index} isFull />
        </HStack> */}
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
