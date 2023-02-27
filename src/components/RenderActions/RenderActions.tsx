import { ButtonGroup, IconButton } from "@chakra-ui/react";

const RenderActions: React.FC<any> = ({ actions, item: itemRow }) => {
  return (
    <ButtonGroup>
      {actions.map((Item: any) => (
        <IconButton
          key={Item.label}
          aria-label={Item.label}
          variant="ghost"
          onClick={() => Item.onClick(itemRow)}
          icon={<Item.icon color={Item.color} />}
        />
      ))}
    </ButtonGroup>
  );
};

export default RenderActions;
