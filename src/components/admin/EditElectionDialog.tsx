
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useElection } from '@/contexts/ElectionContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Candidate } from '@/types/election';

interface EditElectionDialogProps {
  electionId: string;
  open: boolean;
  onClose: () => void;
}

const EditElectionDialog: React.FC<EditElectionDialogProps> = ({ electionId, open, onClose }) => {
  const { elections, updateElection, addCandidate, removeCandidate } = useElection();
  const { toast } = useToast();
  
  const election = elections.find(e => e.id === electionId);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    image: '/placeholder.svg'
  });
  
  const [showAddCandidate, setShowAddCandidate] = useState(false);

  useEffect(() => {
    if (election) {
      setFormData({
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        isActive: election.isActive
      });
    }
  }, [election]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    updateElection(electionId, formData);
    
    toast({
      title: "Election Updated",
      description: "Election has been updated successfully",
    });
    
    onClose();
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.party) {
      toast({
        title: "Validation Error",
        description: "Please fill in candidate name and party",
        variant: "destructive",
      });
      return;
    }
    
    addCandidate(electionId, newCandidate);
    setNewCandidate({ name: '', party: '', image: '/placeholder.svg' });
    setShowAddCandidate(false);
    
    toast({
      title: "Candidate Added",
      description: "Candidate has been added successfully",
    });
  };

  const handleRemoveCandidate = (candidateId: string) => {
    if (window.confirm('Are you sure you want to remove this candidate?')) {
      removeCandidate(electionId, candidateId);
      toast({
        title: "Candidate Removed",
        description: "Candidate has been removed successfully",
      });
    }
  };

  if (!election) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Election</DialogTitle>
          <DialogDescription>
            Update election details and manage candidates
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Election Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter election title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter election description"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Current Candidates</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddCandidate(!showAddCandidate)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </div>
            
            <div className="space-y-2">
              {election.candidates.map((candidate: Candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {candidate.party} • {candidate.votes} votes
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveCandidate(candidate.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {showAddCandidate && (
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Add New Candidate</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                      placeholder="Candidate name"
                    />
                  </div>
                  
                  <div>
                    <Label>Party</Label>
                    <Input
                      value={newCandidate.party}
                      onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                      placeholder="Political party"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddCandidate(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={handleAddCandidate}
                  >
                    Add Candidate
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Election
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditElectionDialog;
