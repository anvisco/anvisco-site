export interface EmailTemplateDefinition {
  key: string
  name: string
  subject: string
  body: string
  placeholders: string[]
}

const COMMON_PLACEHOLDERS = [
  '{{client_name}}',
  '{{business_name}}',
  '{{stage}}',
  '{{payment_due_date}}',
  '{{payment_amount}}',
]

export const EMAIL_TEMPLATES: EmailTemplateDefinition[] = [
  {
    key: 'audit_follow_up',
    name: 'Audit follow-up',
    subject: 'Next steps for {{business_name}}',
    body:
      'Hi {{client_name}},\n\nI reviewed {{business_name}} and wanted to send the next step based on the audit. Current stage: {{stage}}.\n\nI’ll keep the recommendation focused on what will move visibility, trust, and bookings forward.\n\nBrian',
    placeholders: COMMON_PLACEHOLDERS,
  },
  {
    key: 'payment_reminder',
    name: 'Payment reminder',
    subject: 'Payment update for {{business_name}}',
    body:
      'Hi {{client_name}},\n\nA payment is coming up for {{business_name}}.\nDue date: {{payment_due_date}}\nAmount: {{payment_amount}}\n\nIf anything needs adjusting before payment, reply here and I’ll sort it out.\n\nBrian',
    placeholders: COMMON_PLACEHOLDERS,
  },
  {
    key: 'stage_update',
    name: 'Stage update',
    subject: 'Project update for {{business_name}}',
    body:
      'Hi {{client_name}},\n\nQuick update on {{business_name}}: the project is currently at the {{stage}} stage.\n\nI’ll keep the next steps short and clear so you always know what’s happening and what comes next.\n\nBrian',
    placeholders: COMMON_PLACEHOLDERS,
  },
  {
    key: 'launch_handover',
    name: 'Launch handover',
    subject: 'Launch handover for {{business_name}}',
    body:
      'Hi {{client_name}},\n\nThe site for {{business_name}} is ready for handover.\n\nCurrent stage: {{stage}}.\nIf you need anything after launch, reply here and I’ll help with the next step.\n\nBrian',
    placeholders: COMMON_PLACEHOLDERS,
  },
  {
    key: 'monthly_care_update',
    name: 'Monthly care update',
    subject: 'Monthly care update for {{business_name}}',
    body:
      'Hi {{client_name}},\n\nHere’s the monthly care update for {{business_name}}.\nCurrent stage: {{stage}}.\n\nThis check keeps small issues from growing and keeps the site moving in the right direction.\n\nBrian',
    placeholders: COMMON_PLACEHOLDERS,
  },
]
