import {FC, useContext, useEffect, useState} from "react"
import {
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Modal,
  ModalClose,
  ModalDialog
} from "@mui/joy"
import {FilterList} from "@mui/icons-material"
import useScreenWidth from "@/lib/hooks/useScreenWidth"
import theme from "@/components/ThemeRegistry/theme"
import {
  ADSBFetchType,
  AircraftHistoryContext
} from "@/lib/providers/AircraftHistoryContext"
import useDebouncedValue from "@/lib/hooks/useDebouncedValue"
import {AIRCRAFT_TYPE_INFO_ITEMS} from "@/services/aircraftTypeInfo"

type SearchResult = {
  label: string
  value: ADSBFetchType
}

const ModalContent: FC = () => {
  const {setFetchType} = useContext(AircraftHistoryContext)
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  const debouncedInputValue = useDebouncedValue(inputValue, 200)

  useEffect(() => {
    if (!debouncedInputValue) {
      setResults([])
      return
    }

    function normalizeValue(value: string): string {
      return value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
    }

    const normalizedInputValue = normalizeValue(debouncedInputValue)

    const newResults: SearchResult[] = []

    if (normalizedInputValue.length >= 3) {
      newResults.push({
        label: `Callsign: ${normalizedInputValue.toUpperCase()}`,
        value: {type: "callsign", callsign: normalizedInputValue.toUpperCase()}
      })
    }

    if (
      normalizedInputValue.length === 6 &&
      /^[0-9a-f]{6}$/.test(normalizedInputValue)
    ) {
      newResults.push({
        label: `Hex: ${normalizedInputValue.toLowerCase()}`,
        value: {type: "hex", hex: normalizedInputValue.toLowerCase()}
      })
    }

    if (normalizedInputValue.length >= 4 && normalizedInputValue.length <= 6) {
      newResults.push({
        label: `Registration: ${normalizedInputValue.toUpperCase()}`,
        value: {
          type: "registration",
          registration: normalizedInputValue.toUpperCase()
        }
      })
    }

    if ("military".includes(normalizedInputValue)) {
      newResults.push({
        label: `All Military Aircraft`,
        value: {type: "mil"}
      })
    }

    const types = AIRCRAFT_TYPE_INFO_ITEMS.filter((type) =>
      normalizeValue(type[5]).includes(normalizedInputValue)
    ).slice(0, 5)

    newResults.push(
      ...types.map<SearchResult>((type) => ({
        label: `${type[4]} ${type[5]}`,
        value: {type: "type", aircraftType: type[0]}
      }))
    )

    setResults(newResults)
  }, [debouncedInputValue])

  return (
    <>
      <Input
        placeholder="Search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <List>
        {results.map((result) => (
          <ListItem key={result.label}>
            <ListItemButton
              onClick={() => {
                setFetchType(result.value)
                setInputValue("")
              }}
            >
              <ListItemContent>{result.label}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

const FilterModal: FC = () => {
  const {fetchType, setFetchType} = useContext(AircraftHistoryContext)
  const [open, setOpen] = useState(false)
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
        <FilterList />
      </IconButton>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          layout={
            screenWidth <= theme.breakpoints.values.sm ? "fullscreen" : "center"
          }
          maxWidth="sm"
          sx={{width: "100%"}}
        >
          <ModalClose />
          <DialogTitle>Filter Aircraft</DialogTitle>
          <DialogContent sx={{mt: 1}}>
            {fetchType.type !== "radius" ? (
              <Button
                sx={{mb: 1}}
                variant="soft"
                onClick={() => setFetchType({type: "radius"})}
              >
                Reset
              </Button>
            ) : null}

            <ModalContent />
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  )
}

export default FilterModal
