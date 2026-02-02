import React, { useEffect } from "react";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { RiSettings3Line } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setMakerStatus } from "../../../../redux/mainReducer";
import { IMaker } from "../../../../types/p2p";

const statusLabels: Record<"active" | "paused" | "disabled", string> = {
  active: "Активен",
  paused: "Пауза",
  disabled: "Отключен",
};

export default function EditStatus({ maker }: { maker: IMaker }) {
  const dispatch = useAppDispatch();
  const reduxStatus = useAppSelector((state) => state.main.maker?.status);

  useEffect(() => {
    if (reduxStatus !== undefined) return;
    if (maker.status === undefined) return;
    dispatch(setMakerStatus(maker.status ?? undefined));
  }, [dispatch, maker.status, reduxStatus]);

  const currentStatus = reduxStatus ?? "paused";

  const updateStatus = (next: "active" | "paused" | "disabled") => {
    dispatch(setMakerStatus(next));
  };

  return (
    <Menu placement="bottom-end" isLazy>
      <MenuButton as={Button} variant="no_contrast">
        <RiSettings3Line size="1.2rem" />
      </MenuButton>
      <MenuList bgColor="bg.800" minW="200px">
        {(["active", "paused", "disabled"] as const).map((status) => (
          <MenuItem
            key={status}
            bgColor="bg.800"
            _hover={{ bgColor: "bg.700" }}
            onClick={() => updateStatus(status)}
          >
            <HStack spacing="3" color="bg.300">
              <span>
                {statusLabels[status]}
                {status === currentStatus ? " •" : ""}
              </span>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
