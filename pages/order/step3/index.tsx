import { useAppSelector } from "../../../redux/hooks";
import { RegularBox, ResponsiveText } from "../../../styles/theme/custom";

const Step3 = () => {
  return (
    <RegularBox maxH="60vh" overflowY="auto" p="2" my="2">
      <ResponsiveText> Terms and Conditions</ResponsiveText>
      <ResponsiveText whiteSpace="normal" size="xs">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
        expedita suscipit quia voluptate voluptatum nihil ratione voluptatibus
        id fugiat assumenda molestias corporis voluptas nostrum harum saepe
        tempore repudiandae, rerum adipisci!
      </ResponsiveText>
    </RegularBox>
  );
};

export default Step3;
