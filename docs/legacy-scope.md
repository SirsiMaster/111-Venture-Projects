# Legacy – Scope & Philosophy

## 1. Mission & Philosophy

**Primary Mission**: To be a compassionate, unwavering "shepherd" for families navigating the practical aftermath of a death. We guide them through every step of "laying a loved one to rest and closing their books," assuming they have **zero prior knowledge**.

**Secondary Mission**: To offer pre-planning tools that make the post-death transition smoother, but the core experience is "Post-End-of-Life" (Post-EoL).

**Tone & Principles**:
*   **Zero Assumed Knowledge**: Every term (Probate, Executor, Certificate) is explained in plain English.
*   **The "Shepherd" Model**: We don't just list tasks; we walk alongside. We break massive burdens into tiny, manageable steps (A -> B -> C).
*   **Radical Reassurance**: We explain *why* a task matters and *what happens* if you delay, reducing anxiety.
*   **Guidance, Not Advice**: We provide a comprehensive procedural backbone but clearly disclaim that we are not legal counsel.

**Non-Goals for PoC**:
*   We do not guarantee 100% legal compliance in every jurisdiction. We model the "Happy Path" for a US-based user to demonstrate the framework.

## 2. The Journey: Phases & Domains

The experience is structured as a chronological **Timeline (Phases)** intersected by **Topics (Domains)**.

### Phases (The "When")
1.  **Immediate (First 24 Hours)**
    *   *Focus*: Safety, legal pronouncement, body transfer, immediate family notification.
    *   *Vibe*: Urgent but calm. "Just do these 3 things right now."
2.  **Short-term (Days 1–7)**
    *   *Focus*: Funeral/memorial planning, securing property, ordering death certificates, urgent work/pet logistics.
    *   *Vibe*: Logistical. "Let's get through this week."
3.  **Early Admin (Weeks 1–4)**
    *   *Focus*: Social Security, employer benefits, finding the Will, paying urgent bills, stopping fraud.
    *   *Vibe*: Administrative. "Protecting the estate."
4.  **Estate & Accounts (Months 1–3)**
    *   *Focus*: Probate (if needed), closing bank accounts, claiming life insurance, vehicle titles, canceling subscriptions.
    *   *Vibe*: Diligent. "Unwinding the threads."
5.  **Long Tail (Months 3–12+)**
    *   *Focus*: Final taxes, property sale/transfer, digital legacy, memorializing, grief support.
    *   *Vibe*: Closure. "Finishing well."

### Domains (The "What")
*   **Legal & Estate**: Wills, trusts, probate, executor duties.
*   **Funeral & Memorial**: Service planning, burial/cremation, obituary.
*   **Government & Benefits**: Social Security, VA, pensions, Medicare.
*   **Finances & Property**: Bank accounts, investments, real estate, vehicles, loans.
*   **Employment & Insurance**: Life insurance, health insurance, employer benefits.
*   **Household & Utilities**: Electric, water, internet, subscriptions, pets.
*   **Digital & Social**: Email, social media, cloud storage, passwords.
*   **Medical & Records**: Medical bills, health history, organ donation.
*   **Mail & Identity**: Credit bureaus, fraud watch, mail forwarding.
*   **Support & Care**: Grief counseling, support groups, thank you notes.

## 3. UX Model & Information Architecture

### Primary Mode: "The Guided Path" (Shepherd Mode)
*   **Target**: The 95% of users who are overwhelmed and don't know where to start.
*   **Flow**:
    1.  **Intake**: "Has your loved one passed?" -> "When?" -> Determines Phase.
    2.  **Focus**: Show **ONE** step at a time.
        *   "Step 3 of 8 in Immediate Phase".
        *   Title + Plain English explanation.
        *   "Why this matters".
        *   "How to do it" (Checklist/Script).
        *   **Action**: [Mark as Done] or [Do Later].
    3.  **Progress**: Visual feedback (progress bar filling, reassuring checkmarks).

### Secondary Mode: "Browse by Topic" (Expert Mode)
*   **Target**: Users who need to jump to a specific issue (e.g., "I need to stop the mail NOW").
*   **Flow**: Grid of Domains -> Domain Detail Page -> List of tasks for that domain across all phases.

### Tertiary Mode: "Checklist & Overview"
*   **Target**: Executor/Admin managing the "Big Picture".
*   **Flow**: Master list of all tasks with filters (Status, Priority, Phase).

## 4. Visual & Interaction Design
*   **Aesthetic**: "Apple-level Polish". Clean, high-contrast, heavy use of whitespace.
*   **Typography**: San Francisco (System UI). Legible, hierarchical.
*   **Palette**:
    *   Background: Off-white/Warm Gray (Calm).
    *   Accent: Muted Teal/Slate Blue (Trust).
    *   Status: Soft Green (Success), Warm Amber (Caution/Pending).
    *   No jarring reds.

## 5. Technical Strategy (PoC)
*   **Stack**: Vanilla HTML/CSS/JS (No build steps for rapid iteration/portability).
*   **Data**: Local JSON state (Mock Data) + LocalStorage persistence.
*   **Deployment**: Progressive Web App (PWA) to simulate native iOS app behavior (installable, offline-capable shell).