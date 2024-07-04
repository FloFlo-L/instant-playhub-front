import React, { useState } from 'react';
import Layout from '@/components/layout/main/LayoutMain';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    avatarUrl: z.string().url().optional(),
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Email is not valid" }).optional(),
});

interface UserProfile {
    avatarUrl: string;
    username: string;
    email: string;
}

const defaultUserProfile: UserProfile = {
    avatarUrl: 'https://github.com/shadcn.png',
    username: 'DefaultUser',
    email: 'user@example.com',
};

const MyProfile = () => {
    const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

    const form = useForm<UserProfile>({
        resolver: zodResolver(formSchema),
        defaultValues: userProfile,
    });

    const onSubmit = (data: UserProfile) => {
        setUserProfile(data);
        // Here you would also send the data to your backend to update the user's profile
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const avatarUrl = URL.createObjectURL(event.target.files[0]);
            setUserProfile((prevState) => ({ ...prevState, avatarUrl }));
            form.setValue("avatarUrl", avatarUrl);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-12 min-h-screen">
                <h1 className="text-4xl font-bold text-center mb-8">My Profile</h1>
                <Card className="max-w-lg mx-auto p-6">
                    <div className="flex flex-col items-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} />
                            <AvatarFallback>{userProfile.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                                <FormField
                                    control={form.control}
                                    name="avatarUrl"
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
                                <Button type="submit" className="w-full">
                                    Save Changes
                                </Button>
                            </form>
                        </Form>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default MyProfile;
