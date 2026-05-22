"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    sizes?: string[];
    colors?: string[];
    selectedSize?: string;
    selectedColor?: string;
};

type CartItem = Product & {
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (
        id: number,
        selectedSize?: string,
        selectedColor?: string
    ) => void;
    increaseQuantity: (
        id: number,
        selectedSize?: string,
        selectedColor?: string
    ) => void;
    decreaseQuantity: (
        id: number,
        selectedSize?: string,
        selectedColor?: string
    ) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("lydias-cart");

        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("lydias-cart", JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (product: Product) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) =>
                    item.id === product.id &&
                    item.selectedSize === product.selectedSize &&
                    item.selectedColor === product.selectedColor
            );

            if (existingItem) {
                return currentCart.map((item) =>
                    item.id === product.id &&
                        item.selectedSize === product.selectedSize &&
                        item.selectedColor === product.selectedColor
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (
        id: number,
        selectedSize?: string,
        selectedColor?: string
    ) => {
        setCart((currentCart) =>
            currentCart.filter(
                (item) =>
                    !(
                        item.id === id &&
                        item.selectedSize === selectedSize &&
                        item.selectedColor === selectedColor
                    )
            )
        );
    };

    const increaseQuantity = (
        id: number,
        selectedSize?: string,
        selectedColor?: string
    ) => {
        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === id &&
                    item.selectedSize === selectedSize &&
                    item.selectedColor === selectedColor
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (
        id: number,
        selectedSize?: string,
        selectedColor?: string
    ) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === id &&
                        item.selectedSize === selectedSize &&
                        item.selectedColor === selectedColor
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("lydias-cart");
    };

    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}