
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useElection } from '@/contexts/ElectionContext';
import { useToast } from '@/hooks/use-toast';
import { User, Shield } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [voterCredentials, setVoterCredentials] = useState({ voterId: '', password: '' });
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const { loginVoter, loginAdmin } = useElection();
  const { toast } = useToast();

  const handleVoterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginVoter(voterCredentials.voterId, voterCredentials.password);
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to the election system!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid voter ID or password",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(adminCredentials.username, adminCredentials.password);
    if (success) {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Election System</CardTitle>
          <CardDescription>Please login to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voter" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="voter" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Voter
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="voter" className="space-y-4">
              <form onSubmit={handleVoterLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voterId">Voter ID</Label>
                  <Input
                    id="voterId"
                    type="text"
                    placeholder="Enter your voter ID"
                    value={voterCredentials.voterId}
                    onChange={(e) => setVoterCredentials({ ...voterCredentials, voterId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voterPassword">Password</Label>
                  <Input
                    id="voterPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={voterCredentials.password}
                    onChange={(e) => setVoterCredentials({ ...voterCredentials, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login as Voter
                </Button>
              </form>
              <div className="text-sm text-muted-foreground text-center">
                Demo credentials: V001 / password123
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminUsername">Username</Label>
                  <Input
                    id="adminUsername"
                    type="text"
                    placeholder="Enter admin username"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login as Admin
                </Button>
              </form>
              <div className="text-sm text-muted-foreground text-center">
                Demo credentials: admin / admin123
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
