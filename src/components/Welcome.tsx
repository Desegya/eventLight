import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./NavBar";

import SideBar from "./SideBar";
import EventGrid from "./EventGrid";

const Welcome = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        md: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "200px 1fr",
        lg: "300px 1fr",
      }}
    >
      <GridItem area="nav" w="100%">
        <NavBar onSearch={(searchText: string) => console.log(searchText)} />
      </GridItem>
      <GridItem area="aside">
        <SideBar
          isOpen={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </GridItem>
      <GridItem
        area="main"
        overflowY="auto"
        height="100vh"
        justifyItems="center"
      >
        <EventGrid />
      </GridItem>
    </Grid>
  );
};

export default Welcome;
