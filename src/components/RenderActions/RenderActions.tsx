import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { FC } from "react";
import { IconType } from "react-icons";

interface RenderActionsProps {
  actions: {
    label: string;
    icon: IconType;
    color: string;
    onClick: (item: any) => void;
  }[];
  item: any;
}

const RenderActions: FC<RenderActionsProps> = ({ actions, item }) => {
  return (
    <ButtonGroup>
      {actions.map(({ icon: Icon, ...action }) => (
        <IconButton
          key={action.label}
          aria-label={action.label}
          variant="ghost"
          onClick={() => action.onClick(item)}
          icon={<Icon color={action.color} />}
        />
      ))}
    </ButtonGroup>
  );
};

export default RenderActions;
