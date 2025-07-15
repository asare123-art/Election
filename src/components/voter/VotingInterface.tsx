
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useElection } from '@/contexts/ElectionContext';
import { useToast } from '@/hooks/use-toast';
import { Election, Candidate } from '@/types/election';
import { Check, Vote, Trophy } from 'lucide-react';

interface VotingInterfaceProps {
  election: Election;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({ election }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { castVote, hasVoterVoted } = useElection();
  const { toast } = useToast();
  
  const hasVoted = hasVoterVoted(election.id);
  const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  
  // Find winning candidate
  const winningCandidate = election.candidates.reduce((winner, candidate) => 
    candidate.votes > winner.votes ? candidate : winner
  );

  const handleVote = () => {
    if (!selectedCandidate) {
      toast({
        title: "No candidate selected",
        description: "Please select a candidate before voting",
        variant: "destructive",
      });
      return;
    }

    const success = castVote(election.id, selectedCandidate);
    if (success) {
      toast({
        title: "Vote Cast Successfully",
        description: "Your vote has been recorded!",
      });
      setShowResults(true);
    } else {
      toast({
        title: "Voting Failed",
        description: "You have already voted in this election",
        variant: "destructive",
      });
    }
  };

  const getVotePercentage = (votes: number): number => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{election.title}</CardTitle>
          <CardDescription>{election.description}</CardDescription>
          {totalVotes > 0 && (
            <Badge variant="secondary">
              Total Votes: {totalVotes}
            </Badge>
          )}
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {election.candidates.map((candidate: Candidate) => {
          const percentage = getVotePercentage(candidate.votes);
          const isWinner = candidate.id === winningCandidate.id && totalVotes > 0;
          
          return (
            <Card 
              key={candidate.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedCandidate === candidate.id ? 'ring-2 ring-primary' : ''
              } ${isWinner && showResults ? 'border-2' : ''}`}
              style={isWinner && showResults ? { borderColor: '#FF0000' } : {}}
              onClick={() => !hasVoted && !showResults && setSelectedCandidate(candidate.id)}
            >
              <CardHeader className="text-center">
                <div className="relative">
                  <img 
                    src={candidate.image} 
                    alt={candidate.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover"
                  />
                  {selectedCandidate === candidate.id && !hasVoted && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  {isWinner && showResults && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                      <Trophy className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                <CardDescription>{candidate.party}</CardDescription>
              </CardHeader>
              
              {(showResults || hasVoted) && (
                <CardContent className="text-center space-y-2">
                  <div className="text-2xl font-bold" style={isWinner ? { color: '#FF0000' } : {}}>
                    {candidate.votes} votes
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {percentage.toFixed(1)}% of total votes
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: isWinner ? '#FF0000' : '#3b82f6'
                      }}
                    />
                  </div>
                  {isWinner && totalVotes > 0 && (
                    <Badge style={{ backgroundColor: '#FF0000', color: 'white' }}>
                      Winner
                    </Badge>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {!hasVoted && !showResults && (
        <div className="text-center">
          <Button 
            onClick={handleVote} 
            disabled={!selectedCandidate}
            className="px-8 py-2 text-lg"
          >
            <Vote className="w-5 h-5 mr-2" />
            Cast Vote
          </Button>
        </div>
      )}

      {hasVoted && !showResults && (
        <div className="text-center">
          <Button 
            onClick={() => setShowResults(true)}
            variant="outline"
            className="px-8 py-2"
          >
            View Results
          </Button>
        </div>
      )}

      {(showResults || hasVoted) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Election Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {election.candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => (
                  <div 
                    key={candidate.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={index === 0 && totalVotes > 0 ? { 
                      borderColor: '#FF0000',
                      backgroundColor: '#fef2f2'
                    } : {}}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold">#{index + 1}</span>
                      <div>
                        <div className="font-semibold">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.party}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-xl font-bold"
                        style={index === 0 && totalVotes > 0 ? { color: '#FF0000' } : {}}
                      >
                        {candidate.votes} votes
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getVotePercentage(candidate.votes).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VotingInterface;
