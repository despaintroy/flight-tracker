import {Container, Typography} from "@mui/joy"
import ListDemo from "@/components/ListDemo"

export default function Home() {
  return (
    <Container sx={{mt: 2}}>
      <Typography level="h1">Hello World</Typography>
      {/*<RadarDemo />*/}
      <ListDemo />
      {/*<Map*/}
      {/*  mapboxAccessToken="<Mapbox access token>"*/}
      {/*  initialViewState={{*/}
      {/*    longitude: -100,*/}
      {/*    latitude: 40,*/}
      {/*    zoom: 3.5*/}
      {/*  }}*/}
      {/*  style={{width: 600, height: 400}}*/}
      {/*  mapStyle="mapbox://styles/mapbox/streets-v9"*/}
      {/*/>*/}
    </Container>
  )
}
