export const getCartItems = () => {
    try {
        const items = localStorage.getItem('cartItems');
        return items ? JSON.parse(items) : [];
    } catch (e) {
        console.error("Failed to parse cart items:", e);
        return [];
    }
}

export const saveCart = (cart) => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    // Dispatch a custom event to notify components that the cart has changed.
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

export const addToCart = (product, quantity) => {
    let cart = getCartItems();

    const existingCartItem = cart.find((item) => item.sku === product.sku);

    if (existingCartItem) {
        cart = cart.map((item) =>
            item.sku === product.sku ? { ...item, quantity: item.quantity + quantity } : item
        );
    } else {
        cart.push({ ...product, quantity });
    }
    saveCart(cart);
}

// New function for "Buy Now"
export const buyNow = (product, quantity) => {
    // This action replaces the entire cart with only the specified item.
    const cart = [{ ...product, quantity }];
    saveCart(cart);
}

export const deleteCartItems = (sku) => {
    // 1. Get the current cart from storage
    let cart = getCartItems();

    // 2. Create a new cart array that excludes (filters out) the item with the matching sku
    const newCart = cart.filter((item) => item.sku !== sku);

    // 3. Save the new (smaller) cart array back to storage
    saveCart(newCart);
}