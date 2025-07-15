
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useElection } from '@/contexts/ElectionContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const VoterManagement: React.FC = () => {
  const { voters, registerVoter, updateVoter, deleteVoter } = useElection();
  const { toast } = useToast();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVoter, setEditingVoter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    voterId: '',
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.voterId || !formData.name || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (editingVoter) {
      updateVoter(editingVoter, formData);
      toast({
        title: "Voter Updated",
        description: "Voter information has been updated successfully",
      });
    } else {
      // Check if voter ID already exists
      const existingVoter = voters.find(v => v.voterId === formData.voterId);
      if (existingVoter) {
        toast({
          title: "Validation Error",
          description: "Voter ID already exists",
          variant: "destructive",
        });
        return;
      }
      
      registerVoter(formData);
      toast({
        title: "Voter Registered",
        description: "Voter has been registered successfully",
      });
    }
    
    setFormData({ voterId: '', name: '', email: '', password: '' });
    setShowAddDialog(false);
    setEditingVoter(null);
  };

  const handleEdit = (voter: any) => {
    setFormData({
      voterId: voter.voterId,
      name: voter.name,
      email: voter.email,
      password: voter.password
    });
    setEditingVoter(voter.id);
    setShowAddDialog(true);
  };

  const handleDelete = (voterId: string) => {
    if (window.confirm('Are you sure you want to delete this voter?')) {
      deleteVoter(voterId);
      toast({
        title: "Voter Deleted",
        description: "Voter has been deleted successfully",
      });
    }
  };

  const resetForm = () => {
    setFormData({ voterId: '', name: '', email: '', password: '' });
    setEditingVoter(null);
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Voter Management</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Register Voter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Voters</CardTitle>
          <CardDescription>
            Manage voter registrations and access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {voters.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No voters registered yet
            </p>
          ) : (
            <div className="space-y-4">
              {voters.map((voter) => (
                <div key={voter.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold">{voter.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {voter.voterId} • {voter.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {voter.hasVoted ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Voted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600 border-gray-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            Not Voted
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(voter)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(voter.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={resetForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVoter ? 'Edit Voter' : 'Register New Voter'}
            </DialogTitle>
            <DialogDescription>
              {editingVoter ? 'Update voter information' : 'Add a new voter to the system'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voterId">Voter ID</Label>
              <Input
                id="voterId"
                value={formData.voterId}
                onChange={(e) => setFormData({ ...formData, voterId: e.target.value })}
                placeholder="Enter voter ID"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVoter ? 'Update Voter' : 'Register Voter'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoterManagement;
