import {FC, useContext, useState} from "react"
import {
  Button,
  DialogContent,
  FormControl,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Radio,
  RadioGroup,
  ToggleButtonGroup
} from "@mui/joy"
import {Search} from "@mui/icons-material"
import useScreenWidth from "@/lib/hooks/useScreenWidth"
import theme from "@/components/ThemeRegistry/theme"
import {AircraftHistoryContext} from "@/lib/providers/AircraftHistoryContext"

enum CategoryType {
  MILITARY = "mil",
  LADD = "ladd",
  PIA = "pia"
}

const CategoryContent: FC = () => {
  const {fetchType, setFetchType} = useContext(AircraftHistoryContext)

  return (
    <FormControl>
      <RadioGroup
        value={fetchType.type}
        onChange={(e) => setFetchType({type: e.target.value as CategoryType})}
      >
        <Radio value={CategoryType.MILITARY} label="Military" />
        <Radio value={CategoryType.LADD} label="LADD" />
        <Radio value={CategoryType.PIA} label="PIA" />
      </RadioGroup>
    </FormControl>
  )
}

const SearchBar: FC = () => {
  const {fetchType, setFetchType} = useContext(AircraftHistoryContext)
  const [open, setOpen] = useState(false)
  const [toggleValue, setToggleValue] = useState("search")
  const screenWidth = useScreenWidth()

  return (
    <>
      <IconButton
        sx={(theme) => ({
          position: "fixed",
          zIndex: 3,
          top: {xs: theme.spacing(1), sm: theme.spacing(2)},
          left: {xs: theme.spacing(1), sm: theme.spacing(2)}
        })}
        variant="solid"
        onClick={() => setOpen(true)}
      >
        <Search />
      </IconButton>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          layout={
            screenWidth <= theme.breakpoints.values.sm ? "fullscreen" : "center"
          }
          maxWidth="sm"
          sx={{width: "100%", pt: 6}}
        >
          <ModalClose />
          <DialogContent>
            {fetchType.type !== "radius" ? (
              <Button
                sx={{mb: 1}}
                variant="soft"
                onClick={() => setFetchType({type: "radius"})}
              >
                Reset
              </Button>
            ) : null}

            <ToggleButtonGroup
              value={toggleValue}
              onChange={(_e, newValue) => {
                if (newValue) setToggleValue(newValue)
              }}
            >
              <Button value="search" fullWidth>
                Search
              </Button>
              <Button value="type" fullWidth>
                Type
              </Button>
              <Button value="category" fullWidth>
                Category
              </Button>
            </ToggleButtonGroup>

            {(() => {
              switch (toggleValue) {
                case "search":
                  return null
                case "type":
                  return null
                case "category":
                  return <CategoryContent />
              }
            })()}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  )
}

export default SearchBar
