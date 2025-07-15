
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useElection } from '@/contexts/ElectionContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus } from 'lucide-react';

interface CreateElectionDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateElectionDialog: React.FC<CreateElectionDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  
  const [candidates, setCandidates] = useState([
    { name: '', party: '', image: '/placeholder.svg' },
    { name: '', party: '', image: '/placeholder.svg' },
    { name: '', party: '', image: '/placeholder.svg' }
  ]);
  
  const { createElection } = useElection();
  const { toast } = useToast();

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
    
    const validCandidates = candidates.filter(c => c.name.trim() && c.party.trim());
    
    if (validCandidates.length < 2) {
      toast({
        title: "Validation Error",
        description: "At least 2 candidates are required",
        variant: "destructive",
      });
      return;
    }
    
    createElection({
      ...formData,
      candidates: validCandidates.map(c => ({ ...c, votes: 0 }))
    });
    
    toast({
      title: "Election Created",
      description: "Election has been created successfully",
    });
    
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      isActive: true
    });
    setCandidates([
      { name: '', party: '', image: '/placeholder.svg' },
      { name: '', party: '', image: '/placeholder.svg' },
      { name: '', party: '', image: '/placeholder.svg' }
    ]);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', party: '', image: '/placeholder.svg' }]);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const updateCandidate = (index: number, field: string, value: string) => {
    const updated = [...candidates];
    updated[index] = { ...updated[index], [field]: value };
    setCandidates(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Election</DialogTitle>
          <DialogDescription>
            Create a new election with candidates and settings
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
              <Label>Candidates</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCandidate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </div>
            
            {candidates.map((candidate, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Candidate {index + 1}</h4>
                  {candidates.length > 2 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeCandidate(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={candidate.name}
                      onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                      placeholder="Candidate name"
                    />
                  </div>
                  
                  <div>
                    <Label>Party</Label>
                    <Input
                      value={candidate.party}
                      onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                      placeholder="Political party"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Election
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateElectionDialog;
