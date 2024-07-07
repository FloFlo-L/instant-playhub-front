import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/layout/main/LayoutMain';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/provider/authProvider";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import DeleteProfile from '@/components/form/DeleteProfile';

const formSchema = z.object({
    profile_picture: z.string().optional(),
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Email is not valid" }).optional(),
});

interface UserProfile {
    profile_picture?: string;
    username: string;
    email: string;
    created_at: string;
}

const MyProfile = () => {
    const { token, userInfo } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const form = useForm<UserProfile>({
        resolver: zodResolver(formSchema),
        defaultValues: userProfile || {},
    });

    useEffect(() => {
        if (userInfo) {
            setUserProfile({
                profile_picture: userInfo.profile_picture,
                username: userInfo.username,
                email: userInfo.email,
            });
            form.reset({
                profile_picture: userInfo.profile_picture,
                username: userInfo.username,
                email: userInfo.email,
            });
        }
    }, [userInfo, form]);

    const onSubmit = async (data: UserProfile) => {
        setIsSubmitting(true);
        const updateData: Partial<UserProfile> = {};

        if (data.username !== userInfo?.username) {
            updateData.username = data.username;
        }
        if (data.profile_picture && data.profile_picture !== userInfo?.profile_picture) {
            updateData.profile_picture = data.profile_picture;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/user/update`,
                updateData,
            );
            toast({ title: "Profile updated successfully!" });
            setIsChanged(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to update profile " + error.response.data.error,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setUserProfile((prevState) => ({
                    ...prevState,
                    profile_picture: base64String,
                }));
                form.setValue("profile_picture", base64String);
                setIsChanged(true);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const subscription = form.watch((values) => {
            const hasChanged =
                values.username !== userInfo?.username ||
                values.profile_picture !== userInfo?.profile_picture;
            setIsChanged(hasChanged);
        });
        return () => subscription.unsubscribe();
    }, [form, userInfo]);

    return (
        <Layout>
            <div className="container max-w-lg mx-auto  py-12 min-h-screen">
                <h1 className="text-4xl font-bold text-center mb-8">My Profile</h1>
                <Card className="p-6">
                    <div className="flex flex-col items-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage 
                                src={userProfile?.profile_picture || 'https://github.com/shadcn.png'} 
                                alt={userProfile?.username || 'DefaultUser'} 
                                className='object-cover'
                            />
                            <AvatarFallback>{userProfile?.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                                <FormField
                                    control={form.control}
                                    name="profile_picture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="picture">Picture</FormLabel>
                                            <FormControl>
                                                <Input id="picture" type="file" onChange={handleAvatarChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    disabled={true}
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={!isChanged || isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please wait
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </form>
                            <div className='flex w-full justify-between items-center mt-8'>
                                <p className="text-sm">Joined on: {userInfo?.created_at.split(" ")[0]}</p>
                                <DeleteProfile />
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default MyProfile;
