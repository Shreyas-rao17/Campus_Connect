
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-400">Username</p>
                        <p className="text-lg font-semibold">{user?.username}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-lg font-semibold">{user?.email}</p>
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">Edit Profile</Button>
                        <Button variant="outline">Update Password</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
