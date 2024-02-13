import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { submitOrder } from "../../../redux/thunks";
import { ResponsiveButton } from "../../../styles/theme/custom";
import NextLink from "next/link";

const OrderButton = () => {
  const dispatch = useAppDispatch();

  const botLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT;

  const handleClick = () => {
    dispatch(submitOrder());
  };

  return (
    // <NextLink target="_blank" href={`${botLink}?start=${uid}`}>
    <ResponsiveButton mb="1" variant="primary" onClick={handleClick}>
      {"SUGGEST EXCHANGE"}
    </ResponsiveButton>
    // </NextLink>
  );
};

export default OrderButton;
