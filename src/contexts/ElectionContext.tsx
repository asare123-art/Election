
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Election, Candidate, Voter, Admin, VoteRecord } from '../types/election';

interface ElectionContextType {
  elections: Election[];
  voters: Voter[];
  admins: Admin[];
  voteRecords: VoteRecord[];
  currentUser: Voter | Admin | null;
  currentUserType: 'voter' | 'admin' | null;
  
  // Auth functions
  loginVoter: (voterId: string, password: string) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Admin functions
  createElection: (election: Omit<Election, 'id' | 'totalVotes'>) => void;
  updateElection: (electionId: string, updates: Partial<Election>) => void;
  deleteElection: (electionId: string) => void;
  addCandidate: (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  removeCandidate: (electionId: string, candidateId: string) => void;
  registerVoter: (voter: Omit<Voter, 'id' | 'hasVoted'>) => void;
  updateVoter: (voterId: string, updates: Partial<Voter>) => void;
  deleteVoter: (voterId: string) => void;
  toggleElectionStatus: (electionId: string) => void;
  
  // Voter functions
  castVote: (electionId: string, candidateId: string) => boolean;
  getVoterElections: () => Election[];
  hasVoterVoted: (electionId: string) => boolean;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<Voter | Admin | null>(null);
  const [currentUserType, setCurrentUserType] = useState<'voter' | 'admin' | null>(null);

  // Initialize with default data
  useEffect(() => {
    const defaultElection: Election = {
      id: '1',
      title: 'Presidential Election 2024',
      description: 'Election for President of the Republic',
      candidates: [
        {
          id: '1',
          name: 'John Smith',
          image: '/placeholder.svg',
          party: 'Democratic Party',
          votes: 0
        },
        {
          id: '2',
          name: 'Jane Doe',
          image: '/placeholder.svg',
          party: 'Republican Party',
          votes: 0
        },
        {
          id: '3',
          name: 'Bob Johnson',
          image: '/placeholder.svg',
          party: 'Independent',
          votes: 0
        }
      ],
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalVotes: 0
    };

    const defaultAdmin: Admin = {
      id: '1',
      username: 'admin',
      password: 'admin123'
    };

    const defaultVoters: Voter[] = [
      {
        id: '1',
        voterId: 'V001',
        name: 'Alice Cooper',
        email: 'alice@example.com',
        password: 'password123',
        hasVoted: false
      },
      {
        id: '2',
        voterId: 'V002',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'password123',
        hasVoted: false
      }
    ];

    setElections([defaultElection]);
    setAdmins([defaultAdmin]);
    setVoters(defaultVoters);
  }, []);

  const loginVoter = (voterId: string, password: string): boolean => {
    const voter = voters.find(v => v.voterId === voterId && v.password === password);
    if (voter) {
      setCurrentUser(voter);
      setCurrentUserType('voter');
      return true;
    }
    return false;
  };

  const loginAdmin = (username: string, password: string): boolean => {
    const admin = admins.find(a => a.username === username && a.password === password);
    if (admin) {
      setCurrentUser(admin);
      setCurrentUserType('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentUserType(null);
  };

  const createElection = (election: Omit<Election, 'id' | 'totalVotes'>) => {
    const newElection: Election = {
      ...election,
      id: Date.now().toString(),
      totalVotes: 0
    };
    setElections(prev => [...prev, newElection]);
  };

  const updateElection = (electionId: string, updates: Partial<Election>) => {
    setElections(prev => prev.map(e => e.id === electionId ? { ...e, ...updates } : e));
  };

  const deleteElection = (electionId: string) => {
    setElections(prev => prev.filter(e => e.id !== electionId));
  };

  const addCandidate = (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      votes: 0
    };
    
    setElections(prev => prev.map(e => 
      e.id === electionId 
        ? { ...e, candidates: [...e.candidates, newCandidate] }
        : e
    ));
  };

  const removeCandidate = (electionId: string, candidateId: string) => {
    setElections(prev => prev.map(e => 
      e.id === electionId 
        ? { ...e, candidates: e.candidates.filter(c => c.id !== candidateId) }
        : e
    ));
  };

  const registerVoter = (voter: Omit<Voter, 'id' | 'hasVoted'>) => {
    const newVoter: Voter = {
      ...voter,
      id: Date.now().toString(),
      hasVoted: false
    };
    setVoters(prev => [...prev, newVoter]);
  };

  const updateVoter = (voterId: string, updates: Partial<Voter>) => {
    setVoters(prev => prev.map(v => v.id === voterId ? { ...v, ...updates } : v));
  };

  const deleteVoter = (voterId: string) => {
    setVoters(prev => prev.filter(v => v.id !== voterId));
  };

  const toggleElectionStatus = (electionId: string) => {
    setElections(prev => prev.map(e => 
      e.id === electionId ? { ...e, isActive: !e.isActive } : e
    ));
  };

  const castVote = (electionId: string, candidateId: string): boolean => {
    if (!currentUser || currentUserType !== 'voter') return false;
    
    const voter = currentUser as Voter;
    const hasAlreadyVoted = voteRecords.some(
      record => record.voterId === voter.id && record.electionId === electionId
    );
    
    if (hasAlreadyVoted) return false;

    // Record the vote
    const voteRecord: VoteRecord = {
      voterId: voter.id,
      candidateId,
      electionId,
      timestamp: new Date().toISOString()
    };
    
    setVoteRecords(prev => [...prev, voteRecord]);
    
    // Update vote counts
    setElections(prev => prev.map(e => {
      if (e.id === electionId) {
        return {
          ...e,
          candidates: e.candidates.map(c => 
            c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
          ),
          totalVotes: e.totalVotes + 1
        };
      }
      return e;
    }));
    
    // Update voter status
    setVoters(prev => prev.map(v => 
      v.id === voter.id ? { ...v, hasVoted: true, votedElectionId: electionId } : v
    ));
    
    return true;
  };

  const getVoterElections = (): Election[] => {
    return elections.filter(e => e.isActive);
  };

  const hasVoterVoted = (electionId: string): boolean => {
    if (!currentUser || currentUserType !== 'voter') return false;
    const voter = currentUser as Voter;
    return voteRecords.some(
      record => record.voterId === voter.id && record.electionId === electionId
    );
  };

  const value: ElectionContextType = {
    elections,
    voters,
    admins,
    voteRecords,
    currentUser,
    currentUserType,
    loginVoter,
    loginAdmin,
    logout,
    createElection,
    updateElection,
    deleteElection,
    addCandidate,
    removeCandidate,
    registerVoter,
    updateVoter,
    deleteVoter,
    toggleElectionStatus,
    castVote,
    getVoterElections,
    hasVoterVoted
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};
