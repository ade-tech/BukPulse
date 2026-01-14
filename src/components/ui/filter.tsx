import { Capitalize } from "@/lib/Captialize";
import type { Category } from "@/lib/types";
import { Button, ButtonGroup, HStack } from "@chakra-ui/react";

type filterProps<T extends Category | "all"> = {
  filterValues: T[];
  filterState: T[number] | null;
  filterUpdate: React.Dispatch<React.SetStateAction<Category | "all">>;
  defaultValue?: T[number] | null;
};

/**
 * Filter Component
 *
 * Provides filtering controls for lists or grids (e.g., songs, albums).
 * Allows users to select filter criteria and updates the parent state.
 *
 * Usage:
 * - Used in list or grid views to filter displayed items.
 */

const Filter = ({
  filterValues,
  filterState,
  filterUpdate,
}: filterProps<Category | "all">) => {
  return (
    <HStack
      w={"full"}
      mb={3}
      zIndex={20}
      overflow={"hidden"}
      className="no-scrollbar"
      overflowX={"auto"}
      py={2}
    >
      <ButtonGroup size={"sm"} variant={"subtle"} color={"white"}>
        {filterValues.map((filter) => (
          <Button
            rounded={"full"}
            color={
              filter === filterState ? "accent.primary.active" : "text.primary"
            }
            value={filter}
            bg={filter === filterState ? "accent.primary/40" : "bg.surface"}
            variant={"outline"}
            px={4}
            key={filter}
            onClick={() => filterUpdate(filter)}
          >
            {Capitalize(filter)}
          </Button>
        ))}
      </ButtonGroup>
    </HStack>
  );
};

export default Filter;
