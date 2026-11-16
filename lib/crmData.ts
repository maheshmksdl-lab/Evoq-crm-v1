// Shared CRM sample data (used by the Leads/Deals pages and the header search).

export type LeadStatus = "New" | "Contacted" | "Qualified" | "In Progress" | "Lost" | "Unqualified";

export interface Lead {
  id: number; name: string; company: string; email: string; mobile: string;
  status: LeadStatus; owner: string; ownerInitials: string; created: string;
  leadSource: string; rating: string;
}

export const ALL_LEADS: Lead[] = [
  { id:1,  name:"Mrs. Shobha R",      company:"Shobha Realty",    email:"",                     mobile:"",               status:"New",         owner:"PM SDL",    ownerInitials:"PM", created:"27 May 2026", leadSource:"Web",       rating:"Hot"  },
  { id:2,  name:"Priya Nair",         company:"Nair & Co",        email:"priya.nair@demo.com",  mobile:"9988776655",     status:"Contacted",   owner:"SE User 1", ownerInitials:"SU", created:"02 Feb 2025", leadSource:"Referral",  rating:"Warm" },
  { id:3,  name:"John Carter",        company:"Carter Traders",   email:"john.carter@demo.com", mobile:"9876543210",     status:"Qualified",   owner:"SE User 1", ownerInitials:"SU", created:"02 Feb 2025", leadSource:"Cold Call", rating:"Hot"  },
  { id:4,  name:"Sudha R",            company:"ddd",              email:"Sudha@gmail.com",      mobile:"76656564456544", status:"In Progress", owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:"Cold" },
  { id:5,  name:"Jaya 56678",         company:"",                 email:"",                     mobile:"76656564456544", status:"New",         owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"Web",       rating:""     },
  { id:6,  name:"Leo $#$#$#",         company:"",                 email:"",                     mobile:"7865443322",     status:"Unqualified", owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:"Cold" },
  { id:7,  name:"gfdsfs%$%^$^%$",    company:"",                 email:"",                     mobile:"9876543212",     status:"Lost",        owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:""     },
  { id:8,  name:"335634656",          company:"",                 email:"",                     mobile:"675432124578",   status:"New",         owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"",          rating:""     },
  { id:9,  name:"Leo",                company:"",                 email:"",                     mobile:"6757567456",     status:"Contacted",   owner:"Admin",     ownerInitials:"AD", created:"22 Jul 2025", leadSource:"Web",       rating:"Cold" },
  { id:10, name:"James Wilson",       company:"Wilson & Partners",email:"james@wilson.com",     mobile:"9876541234",     status:"Qualified",   owner:"PM SDL",    ownerInitials:"PM", created:"15 May 2026", leadSource:"Referral",  rating:"Hot"  },
  { id:11, name:"Sara Kim",           company:"TechFlow Ltd",     email:"sara.kim@techflow.io", mobile:"8765432109",     status:"In Progress", owner:"SE User 1", ownerInitials:"SU", created:"10 Apr 2026", leadSource:"Trade Show",rating:"Warm" },
  { id:12, name:"Raj Mehta",          company:"Apex Group",       email:"raj@apex.in",          mobile:"9845123456",     status:"New",         owner:"Admin",     ownerInitials:"AD", created:"08 Mar 2026", leadSource:"Web",       rating:"Hot"  },
];

export type DealStage = "Qualification" | "Needs Analysis" | "Value Proposition" |
  "Identify Decision Makers" | "Proposal/Price Quote" | "Negotiation/Review" | "Closed Won";

export interface Deal {
  id: number; name: string; amount: number; account: string;
  stage: DealStage; probability: number; contactName: string;
  createdBy: string; modifiedBy: string; creation: string; modified: string;
  owner: string; ownerInitials: string;
}

export const ALL_DEALS: Deal[] = [
  { id:1,  name:"New",                         amount:29999,  account:"Sweany Inc",    stage:"Proposal/Price Quote",      probability:75, contactName:"",                 createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"27 May 2026, 03:14 PM", modified:"30 May 2026, 02:10 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:2,  name:"Deal SDL 11",                 amount:500000, account:"SDL LEAD1",     stage:"Identify Decision Makers",  probability:60, contactName:"Lead SDL 11",      createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"15 Apr 2026, 11:13 AM", modified:"05 May 2026, 04:55 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:3,  name:"test deal john smith",        amount:200000, account:"Sears Homelife",stage:"Qualification",             probability:0,  contactName:"John Smith",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:45 PM", modified:"14 Apr 2026, 07:45 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:4,  name:"testing",                     amount:500000, account:"RMVT",          stage:"Needs Analysis",            probability:20, contactName:"Raja rajan",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:30 PM", modified:"14 Apr 2026, 07:34 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:5,  name:"fsm enterprise application",  amount:800000, account:"RMVT",          stage:"Needs Analysis",            probability:20, contactName:"mmmm mmmm",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:53 PM", modified:"14 Apr 2026, 07:07 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:6,  name:"CRM Application",             amount:200000, account:"SDL",           stage:"Qualification",             probability:10, contactName:"SDL Test Test-SDL", createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:04 PM", modified:"14 Apr 2026, 07:04 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:7,  name:"fsm single user application", amount:200000, account:"RMVT",          stage:"Qualification",             probability:0,  contactName:"Raja rajan",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:40 PM", modified:"14 Apr 2026, 06:40 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:8,  name:"CRM Application",             amount:500000, account:"RMVT",          stage:"Qualification",             probability:0,  contactName:"Vishnutharan R",   createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:38 PM", modified:"14 Apr 2026, 06:38 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:9,  name:"Deal test",                   amount:150000, account:"test",          stage:"Qualification",             probability:10, contactName:"test test",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:35 PM", modified:"13 Apr 2026, 06:35 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:10, name:"test",                        amount:50000,  account:"test",          stage:"Needs Analysis",            probability:20, contactName:"test test",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:17 PM", modified:"13 Apr 2026, 06:34 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:11, name:"Smith",                       amount:100000, account:"test",          stage:"Value Proposition",         probability:40, contactName:"John Smith",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:00 PM", modified:"13 Apr 2026, 06:02 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:12, name:"Mike",                        amount:0,      account:"Speedy Motors", stage:"Qualification",             probability:0,  contactName:"Speedy Mike",      createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 05:56 PM", modified:"13 Apr 2026, 05:56 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:13, name:"Test",                        amount:10000,  account:"SDL",           stage:"Proposal/Price Quote",      probability:75, contactName:"",                 createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"25 Mar 2026, 08:10 PM", modified:"07 Apr 2026, 04:53 PM", owner:"PM SDL",    ownerInitials:"PM" },
];
