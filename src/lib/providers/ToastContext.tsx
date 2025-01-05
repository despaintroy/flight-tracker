"use client"

import {Close} from "@mui/icons-material"
import {
  Box,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  SnackbarProps,
  Typography
} from "@mui/joy"
import {createContext, useCallback, useContext, useState} from "react"

type ToastProps = Pick<
  SnackbarProps,
  "autoHideDuration" | "variant" | "color" | "startDecorator"
> & {
  title: string
  description?: string
  closeOnClickAway?: boolean
}

type ToastContextType = {
  showToast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType>({showToast: () => {}})

export function ToastProvider({children}: {children: React.ReactNode}) {
  const [toastQueue, setToastQueue] = useState<ToastProps[]>([])
  const [open, setOpen] = useState(true)

  const toast = toastQueue.at(0)

  const showToast: ToastContextType["showToast"] = useCallback((props) => {
    setToastQueue((prev) => [...prev, props])
  }, [])

  const handleClose = useCallback(
    (_event: any, reason?: SnackbarCloseReason) => {
      if (!toast?.closeOnClickAway && reason === "clickaway") {
        return
      }

      setOpen(false)
      setTimeout(() => {
        setToastQueue((prev) => prev.slice(1))
        setOpen(true)
      }, 200)
    },
    [toast?.closeOnClickAway]
  )

  const variant = toast?.variant ?? "solid"

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}

      <Snackbar
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        open={open && toastQueue.length > 0}
        onClose={handleClose}
        autoHideDuration={toast?.autoHideDuration}
        variant={variant}
        color={toast?.color}
        startDecorator={toast?.startDecorator}
        invertedColors={variant === "solid"}
        endDecorator={
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        }
        sx={{maxWidth: "25rem"}}
      >
        <Box>
          <Typography level="title-md">{toast?.title}</Typography>
          {toast?.description && (
            <Typography level="body-md">{toast?.description}</Typography>
          )}
        </Box>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useShowToast(): ToastContextType["showToast"] {
  return useContext(ToastContext).showToast
}
