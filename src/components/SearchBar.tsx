import {FC, useContext, useEffect, useRef, useState} from "react"
import {
  Button,
  DialogContent,
  FormControl,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Modal,
  ModalClose,
  ModalDialog,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  Tabs
} from "@mui/joy"
import {Search} from "@mui/icons-material"
import useScreenWidth from "@/lib/hooks/useScreenWidth"
import theme from "@/components/ThemeRegistry/theme"
import {
  ADSBFetchType,
  AircraftHistoryContext
} from "@/lib/providers/AircraftHistoryContext"
import {AircraftType, searchTypes} from "@/services/searchTypes"
import useDebouncedValue from "@/lib/hooks/useDebouncedValue"

type SearchResult = {
  label: string
  value: ADSBFetchType
}

const SearchContent: FC = () => {
  const {setFetchType} = useContext(AircraftHistoryContext)
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  const debouncedInputValue = useDebouncedValue(inputValue, 200)

  // const requestIdRef = useRef(Math.random())
  useEffect(() => {
    if (!debouncedInputValue) {
      setResults([])
      return
    }

    const newResults: SearchResult[] = []

    if (debouncedInputValue.length >= 3) {
      newResults.push({
        label: `Callsign: ${debouncedInputValue.toUpperCase()}`,
        value: {type: "callsign", callsign: debouncedInputValue.toUpperCase()}
      })
    }

    if (
      debouncedInputValue.length === 6 &&
      /^[0-9a-f]{6}$/.test(debouncedInputValue)
    ) {
      newResults.push({
        label: `Hex: ${debouncedInputValue.toLowerCase()}`,
        value: {type: "hex", hex: debouncedInputValue.toLowerCase()}
      })
    }

    if (debouncedInputValue.length >= 4 && debouncedInputValue.length <= 6) {
      newResults.push({
        label: `Registration: ${debouncedInputValue.toUpperCase()}`,
        value: {
          type: "registration",
          registration: debouncedInputValue.toUpperCase()
        }
      })
    }

    setResults(newResults)

    // const requestId = Math.random()
    // requestIdRef.current = requestId

    // searchTypes(debouncedInputValue)
    //   .then((data) => {
    //     console.log(data)
    //     if (requestId !== requestIdRef.current) return
    //
    //     setResults(
    //       data
    //         .map<SearchResult>((type) => ({
    //           label: type.manufacturerModel,
    //           value: {type: "type", aircraftType: type.aircraftType}
    //         }))
    //         .concat(newResults)
    //     )
    //   })
    //   .catch(console.error)
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

const TypeContent: FC = () => {
  const {setFetchType} = useContext(AircraftHistoryContext)

  const [data, setData] = useState<AircraftType[]>([])
  const [inputValue, setInputValue] = useState("")

  const debouncedInputValue = useDebouncedValue(inputValue, 500)

  const requestIdRef = useRef(Math.random())
  useEffect(() => {
    if (!debouncedInputValue) {
      setData([])
      return
    }

    const requestId = Math.random()
    requestIdRef.current = requestId

    searchTypes(debouncedInputValue).then((data) => {
      if (requestId === requestIdRef.current) setData(data)
    })
  }, [debouncedInputValue])

  return (
    <>
      <Input
        placeholder="Search aircraft type"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <List>
        {data.map((type) => (
          <ListItem key={type.aircraftType}>
            <ListItemButton
              onClick={() => {
                setFetchType({type: "type", aircraftType: type.aircraftType})
                setInputValue("")
                setData([])
              }}
            >
              <ListItemContent>{type.manufacturerModel}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

const SearchBar: FC = () => {
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

            <Tabs orientation="horizontal">
              <TabList tabFlex={1}>
                <Tab>Search</Tab>
                <Tab>Category</Tab>
              </TabList>

              <TabPanel value={0}>
                <SearchContent />
              </TabPanel>
              <TabPanel value={1}>
                <CategoryContent />
              </TabPanel>
            </Tabs>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  )
}

export default SearchBar
