import { useAppDispatch } from "../../../redux/hooks";
import { createOrder } from "../../../redux/thunks";
import { ResponsiveButton } from "../../../styles/theme/custom";
import NextLink from "next/link";

const OrderButton = () => {
  const dispatch = useAppDispatch();

  const botLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT;
  const uid = "ref_" + new Date().getTime().toString(36) + "pie";

  const handleClick = () => {
    dispatch(createOrder(uid));
  };

  return (
    <NextLink target="_blank" href={`${botLink}?start=${uid}`}>
      <ResponsiveButton mb="1" variant="primary" onClick={handleClick}>
        {"SUGGEST EXCHANGE"}
      </ResponsiveButton>
    </NextLink>
  );
};

export default OrderButton;
