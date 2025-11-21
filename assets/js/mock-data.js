/**
 * Mock Data for Legacy App PoC
 * Models a realistic scenario: "John Doe (Son)" managing the estate of "Robert Doe (Father)"
 */

const MOCK_DATA = {
    profile: {
        user: {
            name: "John Doe",
            role: "Executor / Son",
            avatar: "JD"
        },
        decedent: {
            name: "Robert Doe",
            relationship: "Father",
            dateOfDeath: "2025-11-18", // Just happened
            location: "Springfield General Hospital",
            hasWill: true
        }
    },
    
    phases: [
        {
            id: "p1",
            order: 1,
            title: "Immediate",
            subtitle: "First 24-48 Hours",
            description: "Focus only on immediate safety, legal pronouncement, and body transfer. Everything else can wait.",
            color: "var(--sm-danger)"
        },
        {
            id: "p2",
            order: 2,
            title: "Short-term",
            subtitle: "Days 2-7",
            description: "Planning the service, securing property, and handling urgent notifications.",
            color: "var(--sm-warning)"
        },
        {
            id: "p3",
            order: 3,
            title: "Early Admin",
            subtitle: "Weeks 1-4",
            description: "Starting the paperwork: Death certificates, Social Security, and locating the Will.",
            color: "var(--sm-primary)"
        },
        {
            id: "p4",
            order: 4,
            title: "Estate & Accounts",
            subtitle: "Months 1-3",
            description: "The heavy lifting: Probate, bank accounts, debts, and insurance claims.",
            color: "var(--sm-secondary)"
        },
        {
            id: "p5",
            order: 5,
            title: "Long Tail",
            subtitle: "Months 3-12+",
            description: "Finalizing taxes, property sales, and closing the estate.",
            color: "var(--sm-success)"
        }
    ],


    domains: [
        { 
            id: "d1", 
            name: "Legal & Estate", 
            icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2"><path d="M12 3v18"/><path d="M8 21h8"/><path d="M3 7h18"/><path d="M6 7v14"/><path d="M18 7v14"/></svg>', 
            desc: "Wills, probate, and executor authority." 
        },
        { 
            id: "d2", 
            name: "Funeral & Memorial", 
            icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2"><path d="M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path d="M6 21v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/><path d="M12 11v4"/><path d="M8 15h8"/></svg>', 
            desc: "Service planning and burial/cremation." 
        },
        { 
            id: "d3", 
            name: "Government & Benefits", 
            icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 10a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0v1z"/></svg>', 
            desc: "Social Security, VA, and Medicare." 
        },
        { 
            id: "d4", 
            name: "Finances", 
            icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', 
            desc: "Bank accounts, debts, and investments." 
        },
        { 
            id: "d5", 
            name: "Housing & Utilities", 
            icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', 
            desc: "Lease/Mortgage, utilities, and security." 
        },
        { 
            id: "d6", 
            name: "Digital & Identity", 
            icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', 
            desc: "Online accounts, social media, and fraud prevention." 
        },
        { 
            id: "d7", 
            name: "Employment & Insurance", 
            icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>', 
            desc: "Life insurance and employer benefits." 
        }
    ],

    tasks: [
        // --- PHASE 1: IMMEDIATE ---
        {
            id: "t1_1",
            phaseId: "p1",
            domainId: "d1",
            title: "Get a Legal Pronouncement of Death",
            description: "Before anything else can happen, a medical professional must officially pronounce the death.",
            whyItMatters: "You cannot move the body or begin any legal processes without this official timestamp.",
            whatYouNeed: "If at home: Call 911 (unexpected) or Hospice nurse (expected). If at hospital: Staff will handle this.",
            howTo: [
                "Locate the attending nurse or physician.",
                "Ask explicitly: 'Has the time of death been recorded in the chart?'",
                "Ask for the 'Pronouncement of Death' form (varies by state).",
                "Write down the exact time of death and the attending physician's full name here."
            ],
            estimatedTime: "Immediate",
            priority: "Critical",
            status: "completed" 
        },
        {
            id: "t1_2",
            phaseId: "p1",
            domainId: "d2",
            title: "Arrange Transportation for the Body",
            description: "Decide where the body should be moved (Funeral Home or Crematory).",
            whyItMatters: "Hospitals/Nursing homes need the body moved quickly (usually within hours).",
            whatYouNeed: "Name of the Funeral Home. You don't need to buy a package yet, just authorize the pickup.",
            howTo: [
                "Call a local funeral home (Google 'funeral homes near me').",
                "Say exactly: 'A death has occurred at [Location]. I need to arrange transportation.'",
                "Provide them with the full name of the deceased and the room number.",
                "Ask for their estimated time of arrival."
            ],
            estimatedTime: "1-2 Hours",
            priority: "Critical",
            status: "pending"
        },
        {
            id: "t1_3",
            phaseId: "p1",
            domainId: "d5",
            title: "Secure the Property & Pets",
            description: "Ensure the home is locked, appliances are off, and pets are cared for.",
            whyItMatters: "Empty homes are targets. Pets need immediate care.",
            whatYouNeed: "Keys to the home, alarm codes.",
            howTo: [
                "Lock all doors, windows, and garage doors.",
                "Adjust thermostat to an energy-saving temp (e.g., 60°F in winter, 80°F in summer).",
                "Empty the fridge of perishable food to prevent spoilage.",
                "Take pets to a temporary caregiver or your home."
            ],
            estimatedTime: "2 Hours",
            priority: "High",
            status: "pending"
        },

        // --- PHASE 2: SHORT TERM ---
        {
            id: "t2_1",
            phaseId: "p2",
            domainId: "d2",
            title: "Schedule the Arrangement Conference",
            description: "Meeting with the funeral director to plan the service and disposition.",
            whyItMatters: "This sets the timeline for the funeral and burial/cremation.",
            whatYouNeed: "Clothing for the deceased, discharge papers (if any), DD-214 (if veteran).",
            howTo: [
                "Call the funeral home you chose.",
                "Ask to schedule the 'Arrangement Conference'.",
                "Ask them what specific documents or clothing you should bring."
            ],
            estimatedTime: "2-4 Hours",
            priority: "High",
            status: "locked"
        },
        {
            id: "t2_2",
            phaseId: "p2",
            domainId: "d1",
            title: "Order Death Certificates",
            description: "Request certified copies of the death certificate from the funeral home.",
            whyItMatters: "You will need an ORIGINAL copy for every bank, insurer, and agency. Photocopies are rarely accepted.",
            whatYouNeed: "Vital stats of deceased (SSN, Parents' names, etc.)",
            howTo: [
                "The funeral director will file the certificate with the state.",
                "Ask for at least 10-12 certified copies.",
                "Expect to pay $10-$25 per copy."
            ],
            automation: {
                type: 'order',
                label: 'Order 10 Copies ($250)',
                processingTime: '3-5 Days'
            },
            estimatedTime: "15 Mins",
            priority: "High",
            status: "locked"
        },

        // --- PHASE 3: EARLY ADMIN ---
        {
            id: "t3_1",
            phaseId: "p3",
            domainId: "d3",
            title: "Notify Social Security",
            description: "Report the death to the SSA to stop payments and apply for survivor benefits.",
            whyItMatters: "Keeping payments sent after death is fraud and they will claw it back, causing bank headaches.",
            whatYouNeed: "SSN of deceased.",
            howTo: [
                "Call 1-800-772-1213 (7am-7pm, M-F).",
                "Say: 'I am calling to report a death.'",
                "Be prepared to wait on hold for 45+ minutes."
            ],
            automation: {
                type: 'form',
                label: 'Auto-File SSA-721 Report',
                processingTime: 'Instant'
            },
            estimatedTime: "1 Hour",
            priority: "Medium",
            status: "locked"
        },
        {
            id: "t3_2",
            phaseId: "p3",
            domainId: "d6",
            title: "Secure Digital Identity",
            description: "Lock down email and social media to prevent hacking or distress.",
            whyItMatters: "Deceased accounts are prime targets for identity theft.",
            howTo: [
                "Identify top 3 accounts (Email, Facebook, LinkedIn).",
                "Log in if you have passwords and change them.",
                "If not, find the 'Memorialization Request' page for each service."
            ],
            automation: {
                type: 'service',
                label: 'Lock Credit & Social Accounts',
                processingTime: '24 Hours'
            },
            estimatedTime: "2 Hours",
            priority: "Medium",
            status: "locked"
        },

         // --- PHASE 4: ESTATE ---
        {
            id: "t4_1",
            phaseId: "p4",
            domainId: "d4",
            title: "Open Estate Bank Account",
            description: "Create a central account for paying estate debts and receiving funds.",
            whyItMatters: "Never mix estate money with your personal money.",
            whatYouNeed: "EIN (Tax ID) for the estate, Letters Testamentary (from court), Death Certificate.",
            howTo: [
                "Go to the IRS website to apply for an EIN (Employer Identification Number) for the estate.",
                "Take the EIN, Death Certificate, and Court Letters to a bank.",
                "Ask to open an 'Estate Checking Account'."
            ],
            estimatedTime: "1-2 Hours (In person)",
            priority: "High",
            status: "locked"
        }
    ],
    // --- NEW MODULES ---
    timeline: [
        { id: "tl1", date: "2025-11-18", title: "Date of Death", type: "milestone", icon: "ph-cross" },
        { id: "tl2", date: "2025-11-19", title: "Pronouncement of Death", type: "task", icon: "ph-file-text" },
        { id: "tl3", date: "2025-11-20", title: "Body Transported to Funeral Home", type: "logistics", icon: "ph-car" },
        { id: "tl4", date: "2025-11-24", title: "Funeral Service (Tentative)", type: "future", icon: "ph-church" },
        { id: "tl5", date: "2025-12-01", title: "Death Certificates Expected", type: "future", icon: "ph-scroll" },
        { id: "tl6", date: "2026-01-15", title: "Probate Hearing", type: "future", icon: "ph-gavel" }
    ],

    contacts: [
        { id: "c1", name: "Alice Doe", role: "Sister / Beneficiary", phone: "555-0101", email: "alice@example.com", avatar: "AD" },
        { id: "c2", name: "James Wilson", role: "Estate Attorney", phone: "555-0199", email: "jwilson@lawfirm.com", avatar: "JW", org: "Wilson Law Group" },
        { id: "c3", name: "Sarah Jenkins", role: "CPA", phone: "555-0145", email: "sarah@cpaservices.com", avatar: "SJ" },
        { id: "c4", name: "Springfield Funeral Home", role: "Service Provider", phone: "555-0122", email: "info@springfieldfh.com", avatar: "SF", org: "Funeral Director" }
    ],

    documents: [
        { id: "doc1", title: "Last Will and Testament", type: "Legal", date: "2020-05-15", size: "2.4 MB", icon: "ph-scroll" },
        { id: "doc2", title: "Revocable Living Trust", type: "Legal", date: "2021-08-22", size: "4.1 MB", icon: "ph-shield-check" },
        { id: "doc3", title: "Life Insurance Policy", type: "Financial", date: "2019-03-10", size: "1.2 MB", icon: "ph-files" },
        { id: "doc4", title: "Property Deed (Main Home)", type: "Asset", date: "2005-06-01", size: "3.5 MB", icon: "ph-house" }
    ]
};
