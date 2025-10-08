import { createContext, useEffect, useState } from "react";
import { getCartItems, saveCart } from "./CartActions";

export const CartContext = createContext()

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState(getCartItems())

    useEffect(() => {
        saveCart(cart)
    }, [cart])

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find(
            (item) =>
                item.id === product.id &&
                item.color === product.color &&
                item.storage === product.storage
            );

            if (existing) {
            return prevCart.map((item) =>
                item.id === product.id &&
                item.color === product.color &&
                item.storage === product.storage
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            } else {
            return [...prevCart, product];
            }
        });
    };


    const deleteCartItem = (deleteItemId, setUpdateCartItems) => {
        const cartItems = getCartItems()

        const updateCartItems = cartItems.filter((item) => item.id !== deleteItemId)
        setUpdateCartItems(updateCartItems)
        setCart(updateCartItems)
    }

    return(<CartContext.Provider value={{cart, addToCart, deleteCartItem}}>
        {children}
    </CartContext.Provider>)

}