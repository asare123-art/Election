
export interface Candidate {
  id: string;
  name: string;
  image: string;
  party: string;
  votes: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  totalVotes: number;
}

export interface Voter {
  id: string;
  voterId: string;
  name: string;
  email: string;
  password: string;
  hasVoted: boolean;
  votedElectionId?: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
}

export interface VoteRecord {
  voterId: string;
  candidateId: string;
  electionId: string;
  timestamp: string;
}
