export const getCartItems = () => {
    return JSON.parse(localStorage.getItem('cartItems')) || []
}

export const saveCart = (cart) => {
    localStorage.setItem('cartItems', JSON.stringify(cart))
}