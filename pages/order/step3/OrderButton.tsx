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
  const status = useAppSelector((state) => state.main.toast.status);
  const fingerprint = useAppSelector((state) => state.main.fingerprint);
  const uid = createUID(fingerprint);

  useEffect(() => {
    const botLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT;
    status === "success" &&
      setTimeout(() => router.push(`${botLink}?start=${uid}`), 1000);
    status === "error" && setTimeout(() => router.reload(), 1000);
  }, [status]);

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
