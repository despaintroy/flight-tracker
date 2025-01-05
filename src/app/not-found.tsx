import * as React from "react"
import Typography from "@mui/joy/Typography"
import {Button, Container, Stack} from "@mui/joy"
import NextLink from "next/link"

export default function NotFound() {
  return (
    <>
      <Container sx={{py: 10}}>
        <Stack alignItems="center">
          <Typography level="h1" fontSize={100} color="neutral">
            404
          </Typography>
          <Typography fontSize={24} mb={5}>
            Page not found
          </Typography>

          <NextLink href="/">
            <Button size="lg">Home &rarr;</Button>
          </NextLink>
        </Stack>
      </Container>
    </>
  )
}
