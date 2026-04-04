import { useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

function ToggleColorMode() {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Button
      onClick={toggleColorMode}
      pos="absolute"
      top="0"
      right="0"
      m="1rem"
      zIndex="1000"
    >
      {colorMode === "dark" ? (
        <SunIcon color="orange.200" />
      ) : (
        <MoonIcon color="blue.700" />
      )}
    </Button>
  );
}

export default ToggleColorMode;
