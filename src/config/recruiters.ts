export interface RecruiterTeamMember {
  code: string;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
}

export const RECRUITER_TEAM: RecruiterTeamMember[] = [
  { code: 'ALICE01', name: 'Alice Sharma', email: 'alice.sharma@recruitmenthub.com', phone: '+91 98765 43201', avatarColor: 'bg-emerald-500' },
  { code: 'BOB02', name: 'Bob Fernandes', email: 'bob.fernandes@recruitmenthub.com', phone: '+91 98765 43202', avatarColor: 'bg-blue-500' },
  { code: 'CHARLIE03', name: 'Charlie Mehta', email: 'charlie.mehta@recruitmenthub.com', phone: '+91 98765 43203', avatarColor: 'bg-indigo-500' },
  { code: 'DIVYA04', name: 'Divya Patel', email: 'divya.patel@recruitmenthub.com', phone: '+91 98765 43204', avatarColor: 'bg-purple-500' },
  { code: 'ETHAN05', name: 'Ethan Rao', email: 'ethan.rao@recruitmenthub.com', phone: '+91 98765 43205', avatarColor: 'bg-pink-500' },
  { code: 'FATIMA06', name: 'Fatima Khan', email: 'fatima.khan@recruitmenthub.com', phone: '+91 98765 43206', avatarColor: 'bg-amber-500' },
  { code: 'GEORGE07', name: 'George Nair', email: 'george.nair@recruitmenthub.com', phone: '+91 98765 43207', avatarColor: 'bg-teal-500' },
  { code: 'HEMA08', name: 'Hema Reddy', email: 'hema.reddy@recruitmenthub.com', phone: '+91 98765 43208', avatarColor: 'bg-rose-500' },
  { code: 'ISHAN09', name: 'Ishan Gupta', email: 'ishan.gupta@recruitmenthub.com', phone: '+91 98765 43209', avatarColor: 'bg-cyan-500' },
  { code: 'JYOTI10', name: 'Jyoti Verma', email: 'jyoti.verma@recruitmenthub.com', phone: '+91 98765 43210', avatarColor: 'bg-violet-500' },
];

export const RECRUITER_CODES = RECRUITER_TEAM.map((r) => r.code);
