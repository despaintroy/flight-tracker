import {FC, useContext, useEffect, useState} from "react"
import {
  Badge,
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
import {Close, FilterList} from "@mui/icons-material"
import useScreenWidth from "@/lib/hooks/useScreenWidth"
import theme from "@/components/ThemeRegistry/theme"
import {
  ADSBFetchType,
  AircraftHistoryContext
} from "@/lib/providers/AircraftHistoryContext"
import useDebouncedValue from "@/lib/hooks/useDebouncedValue"
import {AIRCRAFT_TYPE_INFO_ITEMS} from "@/services/aircraftTypeInfo"
import {getFetchTypeLabel} from "@/lib/helpers"

const ModalContent: FC = () => {
  const {setFetchType} = useContext(AircraftHistoryContext)
  const [inputValue, setInputValue] = useState("")
  const [options, setOptions] = useState<ADSBFetchType[]>([])

  const debouncedInputValue = useDebouncedValue(inputValue, 200)

  useEffect(() => {
    if (!debouncedInputValue) {
      setOptions([])
      return
    }

    function normalizeValue(value: string): string {
      return value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
    }

    const normalizedInputValue = normalizeValue(debouncedInputValue)

    const newOptions: ADSBFetchType[] = []

    if (normalizedInputValue.length >= 3) {
      newOptions.push({
        type: "callsign",
        callsign: normalizedInputValue.toUpperCase()
      })
    }

    if (
      normalizedInputValue.length === 6 &&
      /^[0-9a-f]{6}$/.test(normalizedInputValue)
    ) {
      newOptions.push({
        type: "hex",
        hex: normalizedInputValue.toLowerCase()
      })
    }

    if (normalizedInputValue.length >= 4 && normalizedInputValue.length <= 6) {
      newOptions.push({
        type: "registration",
        registration: normalizedInputValue.toUpperCase()
      })
    }

    if ("military".includes(normalizedInputValue)) {
      newOptions.push({type: "mil"})
    }

    const types = AIRCRAFT_TYPE_INFO_ITEMS.filter((type) =>
      normalizeValue(type[5]).includes(normalizedInputValue)
    ).slice(0, 5)

    newOptions.push(
      ...types.map<ADSBFetchType>((type) => ({
        type: "type",
        aircraftType: type[0]
      }))
    )

    if (/^[0-9]{4}$/.test(normalizedInputValue)) {
      newOptions.push({
        type: "squawk",
        squawk: normalizedInputValue
      })
    }

    setOptions(newOptions)
  }, [debouncedInputValue])

  return (
    <>
      <Input
        placeholder="Search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <List>
        {options.map((option) => {
          const label = getFetchTypeLabel(option)

          return (
            <ListItem key={label}>
              <ListItemButton
                onClick={() => {
                  setFetchType(option)
                  setInputValue("")
                }}
              >
                <ListItemContent>{label}</ListItemContent>
              </ListItemButton>
            </ListItem>
          )
        })}
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
        <Badge badgeInset="-20%" invisible={fetchType.type === "radius"}>
          <FilterList />
        </Badge>
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
                endDecorator={<Close />}
              >
                {getFetchTypeLabel(fetchType)}
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
