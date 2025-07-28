import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"
import type { Payload } from "../types/payload";

export const useAuth = () => {
    const [authInfo, setAuthInfo] = useState<{
        checked: boolean,
        isAuthenticated: boolean
    }>({ checked: false, isAuthenticated: false });

    useEffect(() => {
        let isAuthenticated = false;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode<Payload>(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    isAuthenticated = true;
                } else {
                    localStorage.removeItem('token');
                }
            }
        } catch (error) {
            setAuthInfo({ checked: true, isAuthenticated: false });
            console.error('認証エラー：', error);
        }
        setAuthInfo({checked: true, isAuthenticated});
    }, [])

    return authInfo;
}