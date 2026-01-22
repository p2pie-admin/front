import React from "react";
import { Box3D } from "../../../../../styles/theme/custom";
import {
  Button,
  Collapse,
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
import DirectionDetails from "./details";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../redux/mainReducer";
import { IMakerOffer } from "../../../../../types/p2p";

type Props = {
  index: number;
  opened: number;
  setOpened: React.Dispatch<React.SetStateAction<number>>;
  handleExpand: (event: React.MouseEvent, index: number) => void;
};

const DirectionItem = ({ index, opened, setOpened, handleExpand }: Props) => {
  const dispatch = useAppDispatch();
  const direction = useAppSelector(
    (state) => state.main.p2pDirections[index],
    shallowEqual,
  );
  const fullOffer = useAppSelector(
    (state) => state.main.p2pFullOffers[index],
    shallowEqual,
  );

  const setField = (
    field: keyof Omit<IMakerOffer, "id" | "dir">,
    value: IMakerOffer[keyof IMakerOffer] | null | undefined,
  ) => {
    dispatch(setP2PFullOfferField({ index, field, value }));
  };


  return (
    <Box3D
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
        gridTemplateColumns={"2fr 40px 2fr 1fr"}
        gridTemplateRows="auto"
        color="bg.500"
        alignItems="center"
        columnGap="2"
      >
        <DirectionPmButton
          side="give"
          directionIndex={index}
          pm={direction?.givePm}
          handleExpand={handleExpand}
        />

        <BsArrowRightShort size="1.5rem" />

        <DirectionPmButton
          side="get"
          directionIndex={index}
          pm={direction?.getPm}
          handleExpand={handleExpand}
        />
        <HStack justifySelf="end">
          <Button variant="ghost">
            {index == opened ? (
              <MdOutlineKeyboardArrowUp size="1.5rem" />
            ) : (
              <MdOutlineKeyboardArrowDown size="1.5rem" />
            )}
          </Button>
        </HStack>
      </Grid>
      <Collapse in={index == opened}>
        <VStack
          align="stretch"
          spacing="3"
          mt="3"
          onClick={(event) => event.stopPropagation()}
        >
          <Text color="bg.300" fontSize="sm">
            Selected: {direction?.givePm?.code || "-"}
            {direction?.getPm?.code || "-"}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="3">
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
          </SimpleGrid>
          <Text color="bg.400" fontSize="xs">
            id: {fullOffer?.id || "-"} | dir: {fullOffer?.dir || "-"}
          </Text>
          <DirectionDetails index={index} />
        </VStack>
      </Collapse>
    </Box3D>
  );
};

export default React.memo(DirectionItem);
