
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useElection } from '@/contexts/ElectionContext';
import { useToast } from '@/hooks/use-toast';
import { Vote, Shield, CheckCircle, Users, Lock } from 'lucide-react';

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
        title: "Welcome Back!",
        description: "You have successfully logged in as a voter.",
        className: "bg-gradient-success border-success",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid voter ID or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(adminCredentials.username, adminCredentials.password);
    if (success) {
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the election management system.",
        className: "bg-gradient-primary border-primary",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4 shadow-glow animate-pulse-slow">
            <Vote className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            SecureVote
          </h1>
          <p className="text-muted-foreground text-lg">
            Secure & Transparent Election System
          </p>
        </div>

        <Card className="election-card animate-slide-up shadow-elegant">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription className="text-base">
              Choose your role to access the election system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs defaultValue="voter" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1.5 rounded-lg h-12">
                <TabsTrigger 
                  value="voter" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-200 font-medium"
                >
                  <Users className="w-4 h-4" />
                  Voter
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-200 font-medium"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voter" className="space-y-5 mt-6">
                <form onSubmit={handleVoterLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="voterId" className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Voter ID
                    </Label>
                    <Input
                      id="voterId"
                      type="text"
                      placeholder="Enter your voter ID"
                      value={voterCredentials.voterId}
                      onChange={(e) => setVoterCredentials({ ...voterCredentials, voterId: e.target.value })}
                      className="professional-input h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voterPassword" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="voterPassword"
                      type="password"
                      placeholder="Enter your password"
                      value={voterCredentials.password}
                      onChange={(e) => setVoterCredentials({ ...voterCredentials, password: e.target.value })}
                      className="professional-input h-12"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary h-12 rounded-lg font-medium text-base"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Sign In as Voter
                  </Button>
                </form>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Demo Credentials:</p>
                    <p>ID: <span className="font-mono bg-background px-2 py-1 rounded">V001</span></p>
                    <p>Password: <span className="font-mono bg-background px-2 py-1 rounded">password123</span></p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-5 mt-6">
                <form onSubmit={handleAdminLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="adminUsername" className="text-sm font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="adminUsername"
                      type="text"
                      placeholder="Enter admin username"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                      className="professional-input h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                      className="professional-input h-12"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary h-12 rounded-lg font-medium text-base"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In as Admin
                  </Button>
                </form>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Demo Credentials:</p>
                    <p>Username: <span className="font-mono bg-background px-2 py-1 rounded">admin</span></p>
                    <p>Password: <span className="font-mono bg-background px-2 py-1 rounded">admin123</span></p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by SecureVote • Built with security in mind
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
