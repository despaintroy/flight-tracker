import {Container, Typography} from "@mui/joy"
import RadarDemo from "@/components/RadarDemo"

// https://airportdb.io

export default function Home() {
  return (
    <Container sx={{mt: 2}}>
      <Typography level="h1">Hello World</Typography>
      <RadarDemo />
      {/*<ListDemo />*/}

      {/*<3ddemo />*/}
    </Container>
  )
}
