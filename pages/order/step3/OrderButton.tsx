import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { submitOrder } from "../../../redux/thunks";
import { ResponsiveButton } from "../../../styles/theme/custom";
import NextLink from "next/link";
import { TbExternalLink } from "react-icons/tb";
import { useEffect } from "react";
import { createUID } from "../../../redux/helper";

const OrderButton = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSuccess = useAppSelector(
    (state) => state.main.toast.status == "success"
  );
  const fingerprint = useAppSelector((state) => state.main.fingerprint);
  const uid = createUID(fingerprint);

  useEffect(() => {
    console.log(fingerprint);
    const botLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT;
    isSuccess &&
      setTimeout(() => router.push(`${botLink}?start=${uid}`, "_blank"), 1000);
  }, [isSuccess]);

  const handleClick = () => {
    dispatch(submitOrder());
  };

  return (
    <ResponsiveButton
      mb="1"
      variant="primary"
      onClick={handleClick}
      rightIcon={<TbExternalLink size="1.2rem" />}
    >
      {"SUBMIT"}
    </ResponsiveButton>
  );
};

export default OrderButton;
