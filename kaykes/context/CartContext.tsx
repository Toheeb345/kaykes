import { createContext } from "react"

export const CartContext = createContext<any>({ cart: [], setCart: () => {} })