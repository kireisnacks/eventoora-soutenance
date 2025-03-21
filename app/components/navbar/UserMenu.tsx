'use client';

import  Avatar  from "../ui/MyAvatar"
import { Separator } from "../ui/separator"

import { Menu } from 'lucide-react';
import { Heart } from 'lucide-react';
import { UserRound } from 'lucide-react';
import { CircleHelp } from 'lucide-react';
import { HandCoins } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { LogIn } from 'lucide-react';
import { Armchair} from 'lucide-react';
import { UserRoundPlus } from 'lucide-react';

import { useCallback, useState } from "react";
import UserMenuItem from "./UserMenuItem";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";

interface UserMenuProps {
    currentUser?: SafeUser | null;
}


const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen ((value) => !value);
    }, []);

    return (
        <div className ="relative">
            <div className ="flex flex-row items-center gap-3">
                <div 
                    onClick={() => {}}
                    className= "hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                >
                    Devenir un hôte
                </div>
                <div
                    onClick={toggleOpen}
                    className="p-4 md: py-1 px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                
                >
                    <Menu />
                    <div className="hidden md:block">
                    <Avatar src={currentUser?.image} />
                    </div>
                </div>
            </div>

            {!isOpen && (
                <div
                className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-20 text-sm"
                >
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                                <>
                                    <UserMenuItem
                                        onClick={() => {}}
                                        label = "Mes Favoris"
                                        icon = {Heart}
                                    />
                                    <UserMenuItem
                                        onClick={() => {}}
                                        label = "Mes Annonces"
                                        icon = {Armchair}
                                    />
                                    <UserMenuItem
                                        onClick={() => {}}
                                        label = "Profil"
                                        icon = {UserRound}
                                    />
                                    <UserMenuItem
                                        onClick={() => {}}
                                        label = "Paiements"
                                        icon = {HandCoins}
                                    />
                                    <Separator />
                                    <UserMenuItem
                                        onClick={() => {}}
                                        label = "Support"
                                        icon = {CircleHelp}
                                    />
                                    <UserMenuItem
                                        onClick={() => signOut()}
                                        label = "Se Déconnecter"
                                        color = "text-red-500"
                                        icon = {LogOut}
                                    />
                                </>

                        ) : (
                            <>
                                <UserMenuItem
                                    onClick={loginModal.onOpen}
                                    label = "Se connecter"
                                    icon = {LogIn}
                                    color = "text-eventoora"
                                />
                                <UserMenuItem
                                    onClick={registerModal.onOpen}
                                    label = "S'inscrire"
                                    icon = {UserRoundPlus}
                                    color = "text-purple-500"
                                />
                                <Separator />
                                <UserMenuItem
                                    onClick={() => {}}
                                    label = "Support"
                                    icon = {CircleHelp}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>

    );
}

export default UserMenu;