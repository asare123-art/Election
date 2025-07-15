
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useElection } from '@/contexts/ElectionContext';
import { Voter } from '@/types/election';
import { LogOut, Vote, CheckCircle } from 'lucide-react';
import VotingInterface from './VotingInterface';

const VoterDashboard: React.FC = () => {
  const { currentUser, logout, getVoterElections, hasVoterVoted } = useElection();
  const [selectedElection, setSelectedElection] = React.useState<string | null>(null);
  
  const voter = currentUser as Voter;
  const availableElections = getVoterElections();
  const selectedElectionData = availableElections.find(e => e.id === selectedElection);

  if (selectedElectionData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Voting</h1>
              <p className="text-muted-foreground">Cast your vote</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedElection(null)}
              >
                Back to Elections
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          <VotingInterface election={selectedElectionData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Voter Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {voter.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Voter ID</label>
                  <p className="text-lg">{voter.voterId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-lg">{voter.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-lg">{voter.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Voting Status</label>
                  <div className="flex items-center space-x-2">
                    {voter.hasVoted ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600">Voted</span>
                      </>
                    ) : (
                      <>
                        <Vote className="w-5 h-5 text-blue-500" />
                        <span className="text-blue-600">Not Voted</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Elections</CardTitle>
              <CardDescription>
                Click on an election to view details and cast your vote
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableElections.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active elections available
                </p>
              ) : (
                <div className="space-y-4">
                  {availableElections.map((election) => {
                    const hasVoted = hasVoterVoted(election.id);
                    return (
                      <div 
                        key={election.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedElection(election.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{election.title}</h3>
                            <p className="text-muted-foreground mb-2">{election.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span>Candidates: {election.candidates.length}</span>
                              <span>Total Votes: {election.totalVotes}</span>
                              <span>Period: {election.startDate} to {election.endDate}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant={election.isActive ? "default" : "secondary"}>
                              {election.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {hasVoted && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Voted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
