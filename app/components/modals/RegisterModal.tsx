'use client';

import axios from 'axios';
import { signIn } from 'next-auth/react';

import { FcGoogle } from 'react-icons/fc';
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModal from '../../hooks/useRegisterModal';
import useLoginModal from '../../hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import SeparatorWithText from './SeparatorWithText';
import Button from '../Button';


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register',data)
        .then(() => {
            toast.success('Compte créé avec succès !');
            registerModal.onClose();
            loginModal.onOpen();
        })
        .catch((error) => {
            toast.error('Une erreur est survenue');
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    },[loginModal,registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading 
                title="Rejoins-nous !"
                subtitle="Trouvez et réservez votre lieu idéal en quelques clics 🖱️ "
                center
            />
            <Input
                id="email"
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required 
            />
            <Input
                id="password"
                type="password"
                label='Password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required 
            />

        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <SeparatorWithText text='ou'/>
            <Button
                outline
                label="Continuer avec Google"
                iconReact={FcGoogle}
                onClick={() => signIn('google')}
            />
            <Button
                outline
                label="Continuer avec Facebook"
                iconReact={FaFacebook}
                onClick={() => {}}
            />
            <Button
                outline
                label="Continuer avec Apple"
                iconReact={FaApple}
                onClick={() => {}}
            />
            <div className="
                text-neutral-500
                text-center
                mt-4
                font-light
            "
            >
                <div className ="flex flex-row items-center gap-2 justify-center">
                    <div>
                        Vous avez déjà un compte ?
                    </div>
                    <div
                        onClick={toggle}
                        className ="
                            text-neutral-800
                            cursor-pointer
                            hover:underline
                        "
                    >
                        Se connecter
                    </div>
                </div>
            </div>
        </div>
    )


    
    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title={"INSCRIPTION"}
            actionLabel="Continuer"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default RegisterModal;