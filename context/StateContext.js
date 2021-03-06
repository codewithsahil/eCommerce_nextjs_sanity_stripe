import React, {useContext, createContext, useState, useEffect} from 'react';
import { toast } from 'react-hot-toast';


const Context = createContext();

export const StateContext = ({children}) =>{
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    const onAdd = (product , quantity) => {
        const checkProductInCart = cartItems.find((cartItem) => cartItem._id === product._id);

        setTotalPrice((prev) => prev + product.price*quantity);
        setTotalQuantities((prev) => prev + quantity);

        if(checkProductInCart) {

            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            });

            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            
            setCartItems([...cartItems , {...product}]);
        }
        
        toast.success(`${quantity} ${product.name} added to the cart`);
    }

    let foundProduct;

    const onRemove = (id) => {
        foundProduct = cartItems.find((item) => item._id === id);
        const newcartItems = cartItems.filter((item) => item._id !== id);
        setTotalPrice((prev) => prev - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prev) => prev - foundProduct.quantity);
        setCartItems(newcartItems);
        setQty(1);
    }

    const toggleCartItemQuantity = (id , value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        
        if (value === 'inc') {
            setCartItems(cartItems.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item));
            setTotalPrice((prev) => prev + foundProduct.price);
            setTotalQuantities((prev) => prev + 1);
        } else if(  value === 'dec') {
            if(foundProduct.quantity > 1) {
                setCartItems(cartItems.map((item) => item._id === id ? { ...foundProduct, quantity: foundProduct.quantity - 1 } : item));
                setTotalPrice((prev) => prev - foundProduct.price);
                setTotalQuantities((prev) => prev - 1);
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty+1);
    }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty <= 1) return 1;
            return prevQty - 1;
        });
    }

    
    return (
        <Context.Provider
        value={{
            showCart,
            setShowCart,
            cartItems,
            totalQuantities,
            totalPrice,
            qty,
            incQty,
            decQty,
            onAdd,
            onRemove,
            toggleCartItemQuantity,
            setCartItems,
            setTotalPrice,
            setTotalQuantities
        }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);
