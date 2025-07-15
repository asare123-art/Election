
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useElection } from '@/contexts/ElectionContext';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import CreateElectionDialog from './CreateElectionDialog';
import EditElectionDialog from './EditElectionDialog';

const ElectionManagement: React.FC = () => {
  const { elections, deleteElection, toggleElectionStatus } = useElection();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingElection, setEditingElection] = useState<string | null>(null);

  const handleDeleteElection = (electionId: string) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      deleteElection(electionId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Election Management</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Election
        </Button>
      </div>

      <div className="grid gap-4">
        {elections.map((election) => (
          <Card key={election.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{election.title}</CardTitle>
                  <CardDescription className="mt-2">{election.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={election.isActive ? "default" : "secondary"}>
                    {election.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleElectionStatus(election.id)}
                  >
                    {election.isActive ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingElection(election.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteElection(election.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Candidates:</span>
                  <div className="text-muted-foreground">{election.candidates.length}</div>
                </div>
                <div>
                  <span className="font-medium">Total Votes:</span>
                  <div className="text-muted-foreground">{election.totalVotes}</div>
                </div>
                <div>
                  <span className="font-medium">Start Date:</span>
                  <div className="text-muted-foreground">{election.startDate}</div>
                </div>
                <div>
                  <span className="font-medium">End Date:</span>
                  <div className="text-muted-foreground">{election.endDate}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Candidates:</h4>
                <div className="flex flex-wrap gap-2">
                  {election.candidates.map((candidate) => (
                    <Badge key={candidate.id} variant="outline">
                      {candidate.name} ({candidate.votes} votes)
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateElectionDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
      />
      
      {editingElection && (
        <EditElectionDialog
          electionId={editingElection}
          open={true}
          onClose={() => setEditingElection(null)}
        />
      )}
    </div>
  );
};

export default ElectionManagement;
