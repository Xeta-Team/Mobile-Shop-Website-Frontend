export const getCartItems = () => {
    return JSON.parse(localStorage.getItem('cartItems')) || []
}

export const saveCart = (cart) => {
    localStorage.setItem('cartItems', JSON.stringify(cart))
}

export const addToCart = (product) => {
    let cart = getCartItems()

    const existingCartItem = cart.find((item) => item.id == product.id)

    if(existingCartItem){
        cart = cart.map((item) => 
            item.id == product.id ? {...item, quantity: item.quantity + 1} : item
        )
    }else{
        cart.push(product)
    }
    saveCart(cart)
}

export const deleteCartItem = (deleteItemId, setUpdateCartItems) => {
    const cartItems = getCartItems()

    const updateCartItems = cartItems.filter((item) => item.id !== deleteItemId)
    setUpdateCartItems(updateCartItems)
    saveCart(updateCartItems)
}