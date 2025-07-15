
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useElection } from '@/contexts/ElectionContext';
import { Trophy, Download, BarChart3 } from 'lucide-react';

const ResultsView: React.FC = () => {
  const { elections, voteRecords } = useElection();
  const [selectedElection, setSelectedElection] = useState<string>('all');

  const filteredElections = selectedElection === 'all' 
    ? elections 
    : elections.filter(e => e.id === selectedElection);

  const generateReport = (election: any) => {
    const reportData = {
      electionTitle: election.title,
      totalVotes: election.totalVotes,
      candidates: election.candidates.map((c: any) => ({
        name: c.name,
        party: c.party,
        votes: c.votes,
        percentage: election.totalVotes > 0 ? ((c.votes / election.totalVotes) * 100).toFixed(1) : '0'
      })).sort((a: any, b: any) => b.votes - a.votes),
      generatedAt: new Date().toLocaleString()
    };

    const reportText = `
ELECTION RESULTS REPORT
======================

Election: ${reportData.electionTitle}
Generated: ${reportData.generatedAt}
Total Votes: ${reportData.totalVotes}

RESULTS:
${reportData.candidates.map((c: any, i: number) => 
  `${i + 1}. ${c.name} (${c.party}) - ${c.votes} votes (${c.percentage}%)`
).join('\n')}

Winner: ${reportData.candidates[0]?.name || 'No votes cast'}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election-report-${election.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Election Results</h2>
        <Select value={selectedElection} onValueChange={setSelectedElection}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select election" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Elections</SelectItem>
            {elections.map((election) => (
              <SelectItem key={election.id} value={election.id}>
                {election.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredElections.map((election) => {
          const winningCandidate = election.candidates.reduce((winner, candidate) => 
            candidate.votes > winner.votes ? candidate : winner
          );
          
          return (
            <Card key={election.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{election.title}</CardTitle>
                    <CardDescription className="mt-1">{election.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={election.isActive ? "default" : "secondary"}>
                      {election.isActive ? "Active" : "Completed"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport(election)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{election.totalVotes}</div>
                    <div className="text-sm text-muted-foreground">Total Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{election.candidates.length}</div>
                    <div className="text-sm text-muted-foreground">Candidates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {election.totalVotes > 0 ? winningCandidate.name : 'No votes'}
                    </div>
                    <div className="text-sm text-muted-foreground">Leading Candidate</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Results
                  </h4>
                  
                  {election.candidates
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate, index) => {
                      const percentage = election.totalVotes > 0 
                        ? (candidate.votes / election.totalVotes) * 100 
                        : 0;
                      const isWinner = index === 0 && election.totalVotes > 0;
                      
                      return (
                        <div 
                          key={candidate.id}
                          className="p-4 border rounded-lg"
                          style={isWinner ? { 
                            borderColor: '#FF0000',
                            backgroundColor: '#fef2f2'
                          } : {}}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold">#{index + 1}</span>
                                {isWinner && (
                                  <Trophy className="w-5 h-5 text-yellow-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold">{candidate.name}</div>
                                <div className="text-sm text-muted-foreground">{candidate.party}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div 
                                className="text-xl font-bold"
                                style={isWinner ? { color: '#FF0000' } : {}}
                              >
                                {candidate.votes}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {percentage.toFixed(1)}%
                              </div>
                            </div>
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
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsView;
