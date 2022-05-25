import axios from 'axios';
import React, { createContext, useEffect, useState, useContext } from 'react';
import { User } from "../models/user.model";
import { createUser, getProfile, login, logout, patchUser } from "../services/v2/auth.service";

interface UserContext {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: Partial<User>) => Promise<void>;
    isLoggedIn: boolean;
    register: (username: string, password: string, firstName: string, lastName: string, email: string) => Promise<void>;
}

const userContext = createContext<UserContext | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    
    const updateUser: UserContext['updateUser'] = async (user) => {
        try {
            const updatedUser = await patchUser(user);
            setUser(updatedUser);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    const handleLogin = async (username: string, password: string): Promise<void> => {
        try {
            const user = await login(username, password);

            setUser(user);
        } catch (error: unknown) {
            setUser(null);
        }
    }

    const handleLogout = async () => {
        if (!user) return Promise.resolve();

        try {
            await logout();
            setUser(null);
        } catch (error: unknown) {
            setUser(null);

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) return Promise.resolve();

                return Promise.reject(error.response?.data.message ?? error.message);
            }

            return Promise.reject(error);
        } finally {
            
        }
    }

    const handleRegister = async (username: string, password: string, firstName: string, lastName: string, email: string): Promise<void> => {
        try {
            await createUser(username, password, firstName, lastName, email);
            await handleLogin(username, password);

        } catch (error: unknown) {
            setUser(null);

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) return Promise.resolve();

                return Promise.reject(error.response?.data.message ?? error.message);
            }

            return Promise.reject(error);
        }
    }

    useEffect(() => {
        const fetchProfile = async (): Promise<void> => {
            try {
                const user = await getProfile();
                setUser(user);
            } catch (error : unknown) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) return Promise.resolve();

                    return Promise.reject(error.response?.data.message ?? error.message);
                }

                return Promise.reject(error);
            }
        }

        fetchProfile();
    }, [])
    
    return (
        <userContext.Provider value={{
            user,
            updateUser,
            login: handleLogin,
            logout: handleLogout,
            isLoggedIn: user !== null,
            register: handleRegister,
        }}>
            {children}
        </userContext.Provider>
    )
}

export const useUserContext = (): UserContext => {
    const context = useContext(userContext);

    if (context === undefined) {
        throw new Error('Missing UserContext');
    }

    return context;
}

export const useProfile = (): [UserContext['user'], UserContext['logout'], UserContext['updateUser']] => {
    const context = useUserContext();

    return [context.user, context.logout, context.updateUser];
}

export const useIsLoggedIn = (): UserContext['isLoggedIn'] => {
    const context = useUserContext();

    return context.isLoggedIn;
}