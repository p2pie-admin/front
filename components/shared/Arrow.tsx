import { ArrowIosDownwardOutline } from "@styled-icons/evaicons-outline/ArrowIosDownwardOutline";
import { ArrowIosUpwardOutline } from "@styled-icons/evaicons-outline/ArrowIosUpwardOutline";
// import { SortDescending } from "@styled-icons/heroicons-solid/SortDescending";
// import { SortAscending } from "@styled-icons/heroicons-solid/SortAscending";
// import { IconButton } from "@chakra-ui/react";
// import { SortAlphaUp } from "@styled-icons/bootstrap/SortAlphaUp";
// import { SortAlphaUpAlt } from "@styled-icons/bootstrap/SortAlphaUpAlt";
import { Icon } from "@chakra-ui/react";

export default function Arrow({ isUp }: { isUp: boolean }) {
  const icon = isUp ? ArrowIosUpwardOutline : ArrowIosDownwardOutline;
  return <Icon as={icon} w={5} h={5} />;
}
