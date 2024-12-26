import "./App.css";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";

import SideBar from "./components/SideBar";
import EventGrid from "./components/EventGrid";

function App() {
  
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        md: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "200px 1fr",
        lg : "300px 1fr"
      }}
    >
      <GridItem area="nav" w="100%">
        <NavBar onSearch={(searchText: string) => console.log(searchText)} />
      </GridItem>
      <GridItem area="aside">
        <SideBar isOpen={false} onClose={function (): void {
          throw new Error("Function not implemented.");
        } } />
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
}

export default App;
