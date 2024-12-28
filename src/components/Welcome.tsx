import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./NavBar";

import SideBar from "./SideBar";
import EventGrid from "./EventGrid";
import { useState } from "react";

const Welcome = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to simulate logging in
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to simulate logging out
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
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
        <NavBar onSearch={(searchText: string) => console.log(searchText)} isAuthenticated={isAuthenticated} onLogout={handleLogout} onLogin={handleLogin} />
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
