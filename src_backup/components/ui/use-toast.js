import { useState, useEffect } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map()

export function useToast() {
  const [state, setState] = useState({
    toasts: [],
  })

  useEffect(() => {
    const timeouts = []

    state.toasts.forEach((toast) => {
      if (toast.duration === Infinity) {
        return
      }

      const timeout = setTimeout(() => {
        toast.dismiss()
      }, toast.duration || 5000)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [state.toasts])

  function toast({ ...props }) {
    const id = generateId()

    const update = (props) =>
      setState((state) => ({
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, ...props } : t
        ),
      }))

    const dismiss = () => setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }))

    setState((state) => ({
      ...state,
      toasts: [
        { ...props, id, dismiss },
        ...state.toasts,
      ].slice(0, TOAST_LIMIT),
    }))

    return {
      id,
      dismiss,
      update,
    }
  }

  return {
    toast,
    toasts: state.toasts,
  }
}
