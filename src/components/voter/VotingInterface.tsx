
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useElection } from '@/contexts/ElectionContext';
import { useToast } from '@/hooks/use-toast';
import { Election, Candidate } from '@/types/election';
import { Check, Vote, Trophy, Users, Crown, Award } from 'lucide-react';

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
        description: "Your vote has been recorded securely!",
        className: "bg-gradient-success border-success",
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
    <div className="space-y-8 animate-fade-in">
      {/* Election Header */}
      <Card className="election-card bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-primary rounded-full p-4 shadow-glow">
              <Vote className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {election.title}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {election.description}
          </CardDescription>
          {totalVotes > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Total Votes: {totalVotes}
            </Badge>
          )}
        </CardHeader>
      </Card>

      {/* Candidates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {election.candidates.map((candidate: Candidate) => {
          const percentage = getVotePercentage(candidate.votes);
          const isWinner = candidate.id === winningCandidate.id && totalVotes > 0;
          const isSelected = selectedCandidate === candidate.id;
          
          return (
            <Card 
              key={candidate.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-hover transform hover:-translate-y-1 ${
                isSelected && !hasVoted && !showResults ? 'ring-2 ring-primary shadow-glow' : ''
              } ${isWinner && showResults ? 'border-2 border-red-500 shadow-glow' : ''} ${
                !hasVoted && !showResults ? 'hover:scale-105' : ''
              } election-card`}
              onClick={() => !hasVoted && !showResults && setSelectedCandidate(candidate.id)}
            >
              <CardHeader className="text-center space-y-4">
                <div className="relative">
                  <div className={`relative w-28 h-28 mx-auto rounded-full overflow-hidden ${
                    isSelected ? 'ring-4 ring-primary ring-offset-4' : ''
                  } ${isWinner && showResults ? 'ring-4 ring-red-500 ring-offset-4' : ''}`}>
                    <img 
                      src={candidate.image} 
                      alt={candidate.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  
                  {isSelected && !hasVoted && !showResults && (
                    <div className="absolute -top-2 -right-2 bg-gradient-success rounded-full p-2 shadow-elegant animate-scale-in">
                      <Check className="w-5 h-5 text-success-foreground" />
                    </div>
                  )}
                  
                  {isWinner && showResults && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full p-2 shadow-elegant animate-glow">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <CardTitle className={`text-xl font-semibold ${
                    isWinner && showResults ? 'text-red-600' : ''
                  }`}>
                    {candidate.name}
                  </CardTitle>
                  <CardDescription className="text-base font-medium">
                    {candidate.party}
                  </CardDescription>
                </div>
              </CardHeader>
              
              {(showResults || hasVoted) && (
                <CardContent className="space-y-4 animate-slide-up">
                  <div className="text-center space-y-2">
                    <div className={`text-3xl font-bold ${
                      isWinner ? 'text-red-600' : 'text-primary'
                    }`}>
                      {candidate.votes}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {percentage.toFixed(1)}% of total votes
                    </div>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        background: isWinner 
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                          : 'var(--gradient-primary)'
                      }}
                    />
                  </div>
                  
                  {isWinner && totalVotes > 0 && (
                    <Badge className="w-full justify-center bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-elegant">
                      <Award className="w-4 h-4 mr-2" />
                      Winner
                    </Badge>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Voting Button */}
      {!hasVoted && !showResults && (
        <div className="text-center animate-slide-up">
          <Button 
            onClick={handleVote} 
            disabled={!selectedCandidate}
            className="btn-primary px-12 py-4 text-lg font-semibold rounded-lg shadow-elegant hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1"
          >
            <Vote className="w-6 h-6 mr-3" />
            Cast Your Vote
          </Button>
          {!selectedCandidate && (
            <p className="text-sm text-muted-foreground mt-3">
              Please select a candidate to cast your vote
            </p>
          )}
        </div>
      )}

      {/* View Results Button */}
      {hasVoted && !showResults && (
        <div className="text-center animate-slide-up">
          <Button 
            onClick={() => setShowResults(true)}
            className="btn-secondary px-8 py-3 text-lg font-medium rounded-lg shadow-elegant hover:shadow-hover transition-all duration-300"
          >
            <Trophy className="w-5 h-5 mr-2" />
            View Results
          </Button>
        </div>
      )}

      {/* Results Summary */}
      {(showResults || hasVoted) && (
        <Card className="election-card animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
              <Trophy className="w-6 h-6 text-accent" />
              Election Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {election.candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => {
                  const percentage = getVotePercentage(candidate.votes);
                  const isWinner = index === 0 && totalVotes > 0;
                  
                  return (
                    <div 
                      key={candidate.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                        isWinner 
                          ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 shadow-elegant' 
                          : 'bg-secondary/50 border border-border'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
                          isWinner 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-elegant' 
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          {index === 0 && totalVotes > 0 ? (
                            <Crown className="w-5 h-5" />
                          ) : (
                            `#${index + 1}`
                          )}
                        </div>
                        <div>
                          <div className={`font-semibold text-lg ${
                            isWinner ? 'text-red-600' : 'text-foreground'
                          }`}>
                            {candidate.name}
                          </div>
                          <div className="text-sm text-muted-foreground font-medium">
                            {candidate.party}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className={`text-2xl font-bold ${
                          isWinner ? 'text-red-600' : 'text-primary'
                        }`}>
                          {candidate.votes}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VotingInterface;
