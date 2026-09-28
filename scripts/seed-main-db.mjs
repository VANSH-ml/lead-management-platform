/**
 * Direct seed for vansh_crm (main dev DB) — bypasses the _test guard.
 * Run: node scripts/seed-main-db.mjs
 */
import pg from 'pg';
import bcrypt from 'bcrypt';

const DB = process.env.DATABASE_URL || 'postgresql://crm_user:crm_local_pass@localhost:5432/vansh_crm';
const SSL = DB.includes('sslmode=require') ? { rejectUnauthorized: false } : false;
const pool = new pg.Pool({ connectionString: DB, ssl: SSL });

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    /* ── 1. Wipe existing CRM data (keep users) ───────────────────────── */
    await client.query(`DELETE FROM conversations`);
    await client.query(`DELETE FROM activity_events WHERE entity_type != 'session'`);
    await client.query(`UPDATE companies SET primary_contact_id = NULL`);
    await client.query(`DELETE FROM contacts`);
    await client.query(`DELETE FROM companies`);
    await client.query(`DELETE FROM lead_import_rows`);
    await client.query(`DELETE FROM lead_imports`);

    /* ── 2. Ensure SDR users exist ────────────────────────────────────── */
    const sdrs = [
      { email: 'rahul@vanshcrm.com', name: 'Rahul Sharma',  role: 'sdr' },
      { email: 'neha@vanshcrm.com',  name: 'Neha Gupta',    role: 'sdr' },
      { email: 'aman@vanshcrm.com',  name: 'Aman Verma',    role: 'sdr' },
    ];
    const hash = await bcrypt.hash('TestSeed123!', 10);
    const userIds = {};
    for (const s of sdrs) {
      const { rows } = await client.query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id, email`,
        [s.email, hash, s.name, s.role]
      );
      userIds[s.email] = rows[0].id;
    }
    // also grab the founder (vansh.wadhwani or founder.seed)
    const { rows: founders } = await client.query(
      `SELECT id, email FROM users WHERE role IN ('founder','admin') LIMIT 1`
    );
    const founderId = founders[0]?.id ?? Object.values(userIds)[0];

    /* ── 3. Companies ─────────────────────────────────────────────────── */
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const in2days = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
    const in3days = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

    const companies = [
      {
        name: 'TechNova Solutions',
        stage: 'Demo Scheduled',
        industry: 'SaaS',
        location: 'Bengaluru',
        employees: 320,
        callVolume: 5000,
        sdr: 'rahul@vanshcrm.com',
        lastContacted: yesterday,
        nextFollowUp: tomorrow,
        notes: 'Very interested in AI call analytics. Budget ₹4.2L/yr. CTO is the champion.',
        website: 'https://technova.io',
      },
      {
        name: 'MediCare Plus',
        stage: 'Discovery Call Done',
        industry: 'Healthcare',
        location: 'Mumbai',
        employees: 850,
        callVolume: 12000,
        sdr: 'rahul@vanshcrm.com',
        lastContacted: twoDaysAgo,
        nextFollowUp: today,
        notes: 'Uses Leadsquared CRM. 3 floors outbound. Want recording + QA automation.',
        website: 'https://medicareplus.in',
      },
      {
        name: 'RetailKing India',
        stage: 'Commercial Proposal Shared',
        industry: 'Retail',
        location: 'Delhi',
        employees: 1200,
        callVolume: 20000,
        sdr: 'neha@vanshcrm.com',
        lastContacted: yesterday,
        nextFollowUp: in2days,
        notes: 'Proposal sent ₹8L/yr. Decision by end of month. VP Sales is DRI.',
        website: 'https://retailking.in',
      },
      {
        name: 'FinEdge Capital',
        stage: 'POC Kickoff',
        industry: 'BFSI',
        location: 'Pune',
        employees: 450,
        callVolume: 8000,
        sdr: 'neha@vanshcrm.com',
        lastContacted: today,
        nextFollowUp: in3days,
        notes: 'POC started. 2 SDRs on trial. Compliance team reviewing data residency.',
        website: 'https://finedge.co.in',
      },
      {
        name: 'LogiFleet Systems',
        stage: 'Follow-up',
        industry: 'Logistics',
        location: 'Chennai',
        employees: 230,
        callVolume: 3000,
        sdr: 'aman@vanshcrm.com',
        lastContacted: yesterday,
        nextFollowUp: today,
        notes: 'Interested but budget constrained. Revisit Q4.',
        website: 'https://logifleet.in',
      },
      {
        name: 'EduSpark Learning',
        stage: 'Demo Scheduled',
        industry: 'EdTech',
        location: 'Hyderabad',
        employees: 180,
        callVolume: 4500,
        sdr: 'aman@vanshcrm.com',
        lastContacted: twoDaysAgo,
        nextFollowUp: tomorrow,
        notes: 'Strong interest in QA for admissions SDR team. Demo booked for Friday.',
        website: 'https://eduspark.co',
      },
      {
        name: 'CloudNest Technologies',
        stage: 'Closed Won',
        industry: 'SaaS',
        location: 'Bengaluru',
        employees: 95,
        callVolume: 2000,
        sdr: 'rahul@vanshcrm.com',
        lastContacted: twoDaysAgo,
        nextFollowUp: null,
        notes: 'Signed ₹3.6L/yr annual contract. Onboarding in progress.',
        website: 'https://cloudnest.tech',
      },
      {
        name: 'BioLabs Research',
        stage: 'Lead Added',
        industry: 'Research / Biotech',
        location: 'Ahmedabad',
        employees: 120,
        callVolume: 1500,
        sdr: 'neha@vanshcrm.com',
        lastContacted: null,
        nextFollowUp: tomorrow,
        notes: 'Inbound lead from website. VP Operations requested a call.',
        website: 'https://biolabs.in',
      },
      {
        name: 'Swiftpay Fintech',
        stage: 'Discovery Call Done',
        industry: 'BFSI',
        location: 'Mumbai',
        employees: 310,
        callVolume: 9000,
        sdr: 'aman@vanshcrm.com',
        lastContacted: yesterday,
        nextFollowUp: in2days,
        notes: 'Good fit. B2B collections team wants call scoring.',
        website: 'https://swiftpay.in',
      },
      {
        name: 'GreenGrow Agri',
        stage: 'Closed Lost',
        industry: 'Other',
        location: 'Jaipur',
        employees: 75,
        callVolume: 800,
        sdr: 'aman@vanshcrm.com',
        lastContacted: twoDaysAgo,
        nextFollowUp: null,
        notes: 'Budget not approved this year. Follow up in April.',
        website: 'https://greengrow.in',
      },
      {
        name: 'Tele Assist Corp',
        stage: 'Demo Delivered',
        industry: 'Telecom',
        location: 'Noida',
        employees: 600,
        callVolume: 15000,
        sdr: 'rahul@vanshcrm.com',
        lastContacted: today,
        nextFollowUp: in2days,
        notes: 'Demo went well. Evaluating 3 vendors. Decision in 2 weeks.',
        website: 'https://teleassist.com',
      },
      {
        name: 'PayZen Solutions',
        stage: 'Final Negotiation',
        industry: 'BFSI',
        location: 'Bengaluru',
        employees: 215,
        callVolume: 6500,
        sdr: 'neha@vanshcrm.com',
        lastContacted: today,
        nextFollowUp: tomorrow,
        notes: 'Last mile pricing discussion. They want 10% discount on annual.',
        website: 'https://payzen.in',
      },
    ];

    const companyIds = {};
    for (const c of companies) {
      const ownerId = userIds[c.sdr] ?? founderId;
      const { rows } = await client.query(
        `INSERT INTO companies (
          company_name, stage, industry, location, employee_count,
          estimated_call_volume, assigned_to, last_contacted, next_follow_up,
          notes, company_website, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, now())
        RETURNING id`,
        [
          c.name, c.stage, c.industry, c.location,
          c.employees, c.callVolume, ownerId,
          c.lastContacted, c.nextFollowUp,
          c.notes, c.website,
        ]
      );
      companyIds[c.name] = rows[0].id;
    }

    /* ── 4. Contacts ──────────────────────────────────────────────────── */
    const contacts = [
      // TechNova
      { company: 'TechNova Solutions', name: 'Arjun Mehta',    role: 'CTO',            phone: '+919845001001', email: 'arjun.mehta@technova.io',       status: 'Connected - Booked a Discovery Call', champion: true },
      { company: 'TechNova Solutions', name: 'Priya Nair',     role: 'Head of Sales',  phone: '+919845001002', email: 'priya.nair@technova.io',         status: 'Connected - Future Follow-up',       champion: false },
      // MediCare
      { company: 'MediCare Plus',      name: 'Dr. Sunita Rao', role: 'VP Operations',  phone: '+919900002001', email: 'sunita.rao@medicareplus.in',      status: 'Interested',                         champion: true },
      { company: 'MediCare Plus',      name: 'Kiran Desai',    role: 'IT Manager',     phone: '+919900002002', email: 'kiran.desai@medicareplus.in',     status: 'Connected - Send Me an Email',       champion: false },
      // RetailKing
      { company: 'RetailKing India',   name: 'Vikram Singh',   role: 'VP Sales',       phone: '+919712003001', email: 'vikram.singh@retailking.in',      status: 'Interested',                         champion: true },
      { company: 'RetailKing India',   name: 'Anita Patel',    role: 'Ops Director',   phone: '+919712003002', email: 'anita.patel@retailking.in',       status: 'Connected - Not Right Person',       champion: false },
      // FinEdge
      { company: 'FinEdge Capital',    name: 'Rohit Joshi',    role: 'Head of Sales',  phone: '+919823004001', email: 'rohit.joshi@finedge.co.in',       status: 'Connected - Booked a Discovery Call', champion: true },
      // LogiFleet
      { company: 'LogiFleet Systems',  name: 'Meena Sharma',   role: 'GM Operations',  phone: '+919500005001', email: 'meena.sharma@logifleet.in',       status: 'Follow-up Required',                 champion: true },
      // EduSpark
      { company: 'EduSpark Learning',  name: 'Amit Khanna',    role: 'Admissions Head',phone: '+919611006001', email: 'amit.khanna@eduspark.co',         status: 'Connected - Booked a Discovery Call', champion: true },
      // CloudNest
      { company: 'CloudNest Technologies', name: 'Sanjay Iyer',role: 'Founder',        phone: '+919845007001', email: 'sanjay@cloudnest.tech',           status: 'Interested',                         champion: true },
      // BioLabs
      { company: 'BioLabs Research',   name: 'Deepa Menon',    role: 'VP Operations',  phone: '+919900008001', email: 'deepa.menon@biolabs.in',          status: 'Not Contacted',                      champion: true },
      // Swiftpay
      { company: 'Swiftpay Fintech',   name: 'Rahul Kapoor',   role: 'Collections Head',phone:'+919876009001', email: 'rahul.kapoor@swiftpay.in',        status: 'Connected - Booked a Discovery Call', champion: true },
      { company: 'Swiftpay Fintech',   name: 'Nisha Bose',     role: 'CTO',            phone: '+919876009002', email: 'nisha.bose@swiftpay.in',          status: "Didn't Pick",                        champion: false },
      // GreenGrow
      { company: 'GreenGrow Agri',     name: 'Tarun Agarwal',  role: 'MD',             phone: '+919700010001', email: 'tarun@greengrow.in',              status: 'Rejected',                           champion: true },
      // Tele Assist
      { company: 'Tele Assist Corp',   name: 'Pooja Verma',    role: 'VP Sales',       phone: '+919811011001', email: 'pooja.verma@teleassist.com',      status: 'Interested',                         champion: true },
      { company: 'Tele Assist Corp',   name: 'Sameer Khan',    role: 'IT Head',        phone: '+919811011002', email: 'sameer.khan@teleassist.com',      status: 'Connected - Send Me an Email',       champion: false },
      // PayZen
      { company: 'PayZen Solutions',   name: 'Divya Menon',    role: 'CEO',            phone: '+919900012001', email: 'divya@payzen.in',                 status: 'Interested',                         champion: true },
      { company: 'PayZen Solutions',   name: 'Arun Thomas',    role: 'CFO',            phone: '+919900012002', email: 'arun.thomas@payzen.in',           status: 'Connected - Future Follow-up',       champion: false },
    ];

    const contactMap = {}; // name → id
    for (const c of contacts) {
      const cid = companyIds[c.company];
      const { rows } = await client.query(
        `INSERT INTO contacts (
          contact_name, company_id, role, phone, email,
          contact_status, champion, last_contacted, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id`,
        [
          c.name, cid, c.role, c.phone, c.email,
          c.status, c.champion,
          c.status === 'Not Contacted' ? null : yesterday,
          c.champion ? 'Key decision maker.' : '',
        ]
      );
      contactMap[c.name] = rows[0].id;
      // set primary contact for champion
      if (c.champion) {
        await client.query(
          `UPDATE companies SET primary_contact_id = $1 WHERE id = $2`,
          [rows[0].id, cid]
        );
      }
    }

    /* ── 5. Activity events ───────────────────────────────────────────── */
    const now = new Date();
    function hoursAgo(h) { return new Date(now - h * 3600000); }
    function daysAgo(d, h = 9) { return new Date(now - d * 86400000 - (9 - h) * 3600000); }

    // Sessions for each SDR (last 3 days)
    const sessionIds = {};
    for (const [email, uid] of Object.entries(userIds)) {
      const loginAt = daysAgo(0, 9);
      const { rows } = await client.query(
        `INSERT INTO user_sessions (user_id, started_at, last_active_at)
         VALUES ($1,$2,$3) RETURNING id`,
        [uid, loginAt, now]
      );
      sessionIds[email] = rows[0].id;
      await client.query(
        `INSERT INTO activity_events (user_id, session_id, event_type, entity_type, summary, payload, created_at)
         VALUES ($1,$2,'session.login','session','Login','{}', $3)`,
        [uid, rows[0].id, loginAt]
      );
    }

    // Activity events per company
    const activityData = [
      { company: 'TechNova Solutions',  contact: 'Arjun Mehta',    sdr: 'rahul@vanshcrm.com', hoursBack: 1,  type: 'contact.status_changed', summary: 'Status: Not Contacted → Connected - Booked a Discovery Call', from: 'Not Contacted', to: 'Connected - Booked a Discovery Call' },
      { company: 'MediCare Plus',       contact: 'Dr. Sunita Rao', sdr: 'rahul@vanshcrm.com', hoursBack: 2,  type: 'contact.status_changed', summary: 'Status: Not Contacted → Interested', from: 'Not Contacted', to: 'Interested' },
      { company: 'RetailKing India',    contact: 'Vikram Singh',   sdr: 'neha@vanshcrm.com',  hoursBack: 3,  type: 'company.stage_changed',  summary: 'Stage → Commercial Proposal Shared (RetailKing India)', from: 'Demo Delivered', to: 'Commercial Proposal Shared' },
      { company: 'FinEdge Capital',     contact: 'Rohit Joshi',    sdr: 'neha@vanshcrm.com',  hoursBack: 4,  type: 'contact.status_changed', summary: 'Status: Not Contacted → Connected - Booked a Discovery Call', from: 'Not Contacted', to: 'Connected - Booked a Discovery Call' },
      { company: 'LogiFleet Systems',   contact: 'Meena Sharma',   sdr: 'aman@vanshcrm.com',  hoursBack: 5,  type: 'contact.status_changed', summary: 'Status: Not Contacted → Follow-up Required', from: 'Not Contacted', to: 'Follow-up Required' },
      { company: 'EduSpark Learning',   contact: 'Amit Khanna',    sdr: 'aman@vanshcrm.com',  hoursBack: 6,  type: 'company.stage_changed',  summary: 'Stage → Demo Scheduled (EduSpark Learning)', from: 'Discovery Call Done', to: 'Demo Scheduled' },
      { company: 'CloudNest Technologies', contact: 'Sanjay Iyer', sdr: 'rahul@vanshcrm.com', hoursBack: 28, type: 'company.stage_changed',  summary: 'Stage → Closed Won (CloudNest Technologies)', from: 'Final Negotiation', to: 'Closed Won' },
      { company: 'Tele Assist Corp',    contact: 'Pooja Verma',    sdr: 'rahul@vanshcrm.com', hoursBack: 7,  type: 'contact.status_changed', summary: 'Status: Not Contacted → Interested', from: 'Not Contacted', to: 'Interested' },
      { company: 'PayZen Solutions',    contact: 'Divya Menon',    sdr: 'neha@vanshcrm.com',  hoursBack: 8,  type: 'company.stage_changed',  summary: 'Stage → Final Negotiation (PayZen Solutions)', from: 'POC Delivered', to: 'Final Negotiation' },
      { company: 'Swiftpay Fintech',    contact: 'Rahul Kapoor',   sdr: 'aman@vanshcrm.com',  hoursBack: 9,  type: 'contact.status_changed', summary: 'Status: Not Contacted → Connected - Booked a Discovery Call', from: 'Not Contacted', to: 'Connected - Booked a Discovery Call' },
      { company: 'TechNova Solutions',  contact: 'Arjun Mehta',    sdr: 'rahul@vanshcrm.com', hoursBack: 26, type: 'contact.note_added',     summary: 'Note updated on Arjun Mehta: "Budget confirmed ₹4.2L"', note: 'Budget confirmed ₹4.2L' },
      { company: 'MediCare Plus',       contact: 'Dr. Sunita Rao', sdr: 'rahul@vanshcrm.com', hoursBack: 27, type: 'contact.follow_up_set',  summary: `Follow-up set for Dr. Sunita Rao`, nextFollowUp: today },
      { company: 'RetailKing India',    contact: 'Vikram Singh',   sdr: 'neha@vanshcrm.com',  hoursBack: 50, type: 'contact.status_changed', summary: 'Status: Not Contacted → Interested', from: 'Not Contacted', to: 'Interested' },
      { company: 'GreenGrow Agri',      contact: 'Tarun Agarwal',  sdr: 'aman@vanshcrm.com',  hoursBack: 52, type: 'company.stage_changed',  summary: 'Stage → Closed Lost (GreenGrow Agri)', from: 'Follow-up', to: 'Closed Lost' },
    ];

    for (const a of activityData) {
      const uid = userIds[a.sdr] ?? founderId;
      const sid = sessionIds[a.sdr] ?? sessionIds[Object.keys(sessionIds)[0]];
      const companyId = companyIds[a.company];
      const contactId = contactMap[a.contact];
      const isContact = a.type.startsWith('contact.');
      await client.query(
        `INSERT INTO activity_events (
          user_id, session_id, event_type, entity_type, entity_id, summary, payload, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8)`,
        [
          uid, sid, a.type,
          isContact ? 'contact' : 'company',
          isContact ? contactId : companyId,
          a.summary,
          JSON.stringify({ from: a.from, to: a.to, note: a.note, nextFollowUp: a.nextFollowUp, name: a.contact }),
          hoursAgo(a.hoursBack),
        ]
      );
    }

    /* ── 6. Follow-ups for today on contacts ─────────────────────────── */
    const followUpContacts = ['Dr. Sunita Rao', 'Meena Sharma', 'Arjun Mehta'];
    for (const name of followUpContacts) {
      const cid = contactMap[name];
      if (cid) {
        await client.query(
          `UPDATE contacts SET next_follow_up = $1 WHERE id = $2`,
          [today, cid]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✅ Seed complete!');
    console.log(`   Companies : ${companies.length}`);
    console.log(`   Contacts  : ${contacts.length}`);
    console.log(`   Activities: ${activityData.length + Object.keys(userIds).length}`);

  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
