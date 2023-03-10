import { CgOptions } from "react-icons/cg";
import { FaRegHandLizard } from "react-icons/fa";
import { TiStarOutline } from "react-icons/ti";
import { RiVipCrown2Line } from "react-icons/ri";
import { BiCheckCircle } from "react-icons/bi";
import { FiPercent } from "react-icons/fi";
import { AiOutlineTrophy } from "react-icons/ai";
import { ITop } from "../../../../types/rates";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineCreditCardOff } from "react-icons/md";

const icons = {
  optimal: CgOptions,
  low_min: FaRegHandLizard,
  best_course: FiPercent,
  top_rating: TiStarOutline,
  top_max: RiVipCrown2Line,
  unique: AiOutlineTrophy,
  fast: HiOutlineLightningBolt,
  private: MdOutlineCreditCardOff,
} as { [key: string]: any };

export const uniqueTop = {
  code: "unique",
  color: "orange",
  title: "Unique",
  en_description: "The unique exchanger for current direction",
  ru_description: "Уникальный обменник по данному направлению",
} as ITop;

export default icons;
