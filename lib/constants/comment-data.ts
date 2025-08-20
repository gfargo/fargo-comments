export const mockComments = [
  {
    id: "1",
    content:
      "The nutrition facts panel appears to be missing the required serving size information. This needs to be addressed before approval.",
    author: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Lead Auditor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
    auditContext: {
      sectionId: "nutrition-facts",
      sectionName: "Nutrition Facts Panel",
      fieldName: "Serving Size",
    },
    sourceReference: {
      id: "ref-1",
      url: "/audit/nutrition-facts#serving-size",
      elementId: "serving-size-field",
      label: "Nutrition Facts Panel - Serving Size",
      description: "FDA required serving size format specification",
      type: "audit_item" as const,
      metadata: {
        sectionName: "Nutrition Facts Panel",
        pageTitle: "CPG Label Audit - Red's Egg'wich",
      },
    },
    reactions: [
      { type: "like" as const, userId: "user2" },
      { type: "like" as const, userId: "user3" },
    ],
  },
  {
    id: "2",
    content:
      "Thanks for catching that! I'll update the serving size information. The current label shows '1 cup (240ml)' but I think we need to be more specific about the weight.",
    author: {
      id: "user3",
      name: "Alex Rivera",
      email: "alex@company.com",
      role: "Brand Manager" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "1",
    createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "high" as const,
  },
  {
    id: "3",
    content:
      "According to FDA guidelines, you need both volume and weight. For this product, it should be '1 cup (240ml, 245g)'. I can send you the exact formatting requirements.",
    author: {
      id: "user2",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Quality Specialist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "1",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
    sourceReference: {
      id: "ref-2",
      url: "https://www.fda.gov/food/food-labeling-nutrition/serving-sizes-food-labeling-guide",
      label: "FDA Serving Size Guidelines",
      description: "Official FDA guidance on serving size formatting requirements",
      type: "regulation" as const,
      metadata: {
        pageTitle: "FDA Food Labeling Guide - Serving Sizes",
      },
    },
  },
  {
    id: "4",
    content:
      "Perfect! That would be really helpful. Also, should we update the calories per serving based on the new weight measurement?",
    author: {
      id: "user3",
      name: "Alex Rivera",
      email: "alex@company.com",
      role: "Brand Manager" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "1",
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
  },
  {
    id: "5",
    content:
      "Yes, definitely. I'll run the nutritional analysis again with the corrected serving size. Give me about 2 hours to get the updated values.",
    author: {
      id: "user4",
      name: "Dr. Lisa Park",
      email: "lisa@company.com",
      role: "Nutritionist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "high" as const,
  },
  {
    id: "6",
    content:
      "I've completed the nutritional analysis. Updated values: 180 calories per serving (245g). I'll upload the full breakdown to the shared folder.",
    author: {
      id: "user4",
      name: "Dr. Lisa Park",
      email: "lisa@company.com",
      role: "Nutritionist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "1",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: "resolved" as const,
    priority: "high" as const,
    sourceReference: {
      id: "ref-3",
      url: "/documents/nutritional-analysis-v2.pdf",
      label: "Updated Nutritional Analysis Report",
      description: "Complete nutritional breakdown with corrected serving size",
      type: "document" as const,
      metadata: {
        pageTitle: "Nutritional Analysis - Red's Egg'wich v2.0",
      },
    },
    reactions: [
      { type: "like" as const, userId: "user1" },
      { type: "like" as const, userId: "user3" },
      { type: "like" as const, userId: "user4" },
    ],
  },
  {
    id: "7",
    content:
      "The allergen statement font size appears to be below the FDA minimum requirement of 6pt. Current measurement shows approximately 5.2pt.",
    author: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Lead Auditor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
    auditContext: {
      sectionId: "allergens",
      sectionName: "Allergen Statement",
      fieldName: "Font Size Compliance",
    },
    sourceReference: {
      id: "ref-4",
      url: "/audit/allergens#font-size",
      elementId: "allergen-font-measurement",
      label: "Allergen Statement Font Size",
      description: "Font size measurement tool results",
      type: "audit_item" as const,
      metadata: {
        sectionName: "Allergen Statement",
        coordinates: { x: 245, y: 680 },
      },
    },
  },
  {
    id: "8",
    content:
      "I can confirm this measurement. The allergen text is definitely too small. This is a critical compliance issue that needs immediate attention.",
    author: {
      id: "user5",
      name: "James Wilson",
      email: "james@company.com",
      role: "Compliance Officer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "7",
    createdAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
  },
  {
    id: "9",
    content:
      "Design team is on it. We'll increase the font size to 6.5pt to ensure compliance with some buffer. ETA: 30 minutes for the updated design.",
    author: {
      id: "user6",
      name: "Design Team",
      email: "design@company.com",
      role: "Designer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "7",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "high" as const,
  },
  {
    id: "10",
    content:
      "Updated design is ready! Font size is now 6.5pt and I've also improved the contrast ratio for better readability. Please review.",
    author: {
      id: "user6",
      name: "Design Team",
      email: "design@company.com",
      role: "Designer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "7",
    createdAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
    status: "resolved" as const,
    priority: "high" as const,
    sourceReference: {
      id: "ref-5",
      url: "/designs/allergen-statement-v3.png",
      label: "Updated Allergen Statement Design",
      description: "Revised design with 6.5pt font and improved contrast",
      type: "image" as const,
      metadata: {
        pageTitle: "Design Assets - Allergen Statement v3",
      },
    },
  },
  {
    id: "11",
    content:
      "The ingredient list looks comprehensive, but I noticed 'natural flavors' is listed. Do we have documentation specifying what these natural flavors are?",
    author: {
      id: "user2",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Quality Specialist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "medium" as const,
    auditContext: {
      sectionId: "ingredients",
      sectionName: "Ingredients Statement",
      fieldName: "Natural Flavors Declaration",
    },
  },
  {
    id: "12",
    content:
      "Good catch! While FDA doesn't require us to specify individual natural flavors, we should have internal documentation. I'll request the flavor profile from our supplier.",
    author: {
      id: "user3",
      name: "Alex Rivera",
      email: "alex@company.com",
      role: "Brand Manager" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "11",
    createdAt: new Date(Date.now() - 7.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7.5 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "medium" as const,
  },
  {
    id: "13",
    content:
      "Supplier confirmed the natural flavors are: vanilla extract, citrus oils (orange, lemon), and natural berry essences. All are GRAS certified.",
    author: {
      id: "user3",
      name: "Alex Rivera",
      email: "alex@company.com",
      role: "Brand Manager" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "11",
    createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
    status: "resolved" as const,
    priority: "medium" as const,
    sourceReference: {
      id: "ref-6",
      url: "/documents/supplier-flavor-specification.pdf",
      label: "Natural Flavors Specification",
      description: "Detailed breakdown of natural flavor components from supplier",
      type: "document" as const,
      metadata: {
        pageTitle: "Supplier Documentation - Natural Flavors",
      },
    },
  },
  {
    id: "14",
    content:
      "The ingredient order looks correct based on weight percentages. Eggs are properly listed before wheat flour.",
    author: {
      id: "user4",
      name: "Dr. Lisa Park",
      email: "lisa@company.com",
      role: "Nutritionist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
    status: "approved" as const,
    priority: "low" as const,
    auditContext: {
      sectionId: "ingredients",
      sectionName: "Ingredients Statement",
      fieldName: "Ingredient Order Verification",
    },
  },
  {
    id: "15",
    content:
      "Should we consider adding 'organic' designation to the wheat flour? Our supplier confirmed it's certified organic.",
    author: {
      id: "user7",
      name: "Emma Thompson",
      email: "emma@company.com",
      role: "Sourcing Manager" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "medium" as const,
    auditContext: {
      sectionId: "ingredients",
      sectionName: "Ingredients Statement",
      fieldName: "Organic Designation",
    },
  },
  {
    id: "16",
    content:
      "The allergen statement placement looks good - it's clearly separated from other text and easily readable.",
    author: {
      id: "user5",
      name: "James Wilson",
      email: "james@company.com",
      role: "Compliance Officer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    status: "approved" as const,
    priority: "low" as const,
    auditContext: {
      sectionId: "allergens",
      sectionName: "Allergen Statement",
      fieldName: "Placement and Visibility",
    },
  },
  {
    id: "17",
    content:
      "Do we need to add a 'May contain soy' warning? The facility also processes soy products according to our supplier audit.",
    author: {
      id: "user2",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Quality Specialist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 8.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8.5 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
    auditContext: {
      sectionId: "allergens",
      sectionName: "Allergen Statement",
      fieldName: "Cross-Contamination Warning",
    },
  },
  {
    id: "18",
    content:
      "The net weight statement format looks correct, but I want to double-check our scale calibration. The actual weight measured 354.8mL instead of 355mL.",
    author: {
      id: "user2",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Quality Specialist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "medium" as const,
    auditContext: {
      sectionId: "net-weight",
      sectionName: "Net Weight Statement",
      fieldName: "Weight Accuracy Verification",
    },
  },
  {
    id: "19",
    content:
      "That's within acceptable tolerance range (±0.5%). FDA allows up to 1% variance for liquid products. I think we're good here.",
    author: {
      id: "user5",
      name: "James Wilson",
      email: "james@company.com",
      role: "Compliance Officer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "18",
    createdAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "medium" as const,
  },
  {
    id: "20",
    content:
      "Agreed, but let's document this measurement for our records. I'll add it to the quality control log with the calibration certificate.",
    author: {
      id: "user2",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Quality Specialist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "18",
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "medium" as const,
    sourceReference: {
      id: "ref-7",
      url: "/documents/scale-calibration-cert.pdf",
      label: "Scale Calibration Certificate",
      description: "Latest calibration certificate for precision scale",
      type: "document" as const,
      metadata: {
        pageTitle: "Quality Control - Scale Calibration",
      },
    },
  },
  {
    id: "21",
    content: "The metric conversion (355 mL) is accurate. I've verified this against our conversion standards.",
    author: {
      id: "user4",
      name: "Dr. Lisa Park",
      email: "lisa@company.com",
      role: "Nutritionist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 13 * 60 * 60 * 1000),
    status: "approved" as const,
    priority: "low" as const,
    auditContext: {
      sectionId: "net-weight",
      sectionName: "Net Weight Statement",
      fieldName: "Metric Conversion Accuracy",
    },
  },
  {
    id: "22",
    content:
      "Font size and placement of the net weight statement meets all regulatory requirements. Clear and prominent as required.",
    author: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Lead Auditor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
    status: "approved" as const,
    priority: "low" as const,
    auditContext: {
      sectionId: "net-weight",
      sectionName: "Net Weight Statement",
      fieldName: "Font Size and Placement",
    },
  },
]

export const mockReportItems = [
  {
    id: "item-1",
    title: "Nutrition Facts Panel",
    status: "needs_review",
    priority: "high",
    description: "Primary nutrition facts panel located on back of package",
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "item-2",
    title: "Allergen Statement",
    status: "resolved",
    priority: "high",
    description: "Contains: Milk, Eggs, Wheat. May contain: Tree nuts",
    lastActivity: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
  },
  {
    id: "item-3",
    title: "Ingredients List",
    status: "resolved",
    priority: "medium",
    description: "Complete ingredient listing in descending order by weight",
    lastActivity: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
  },
  {
    id: "item-4",
    title: "Net Weight Statement",
    status: "approved",
    priority: "low",
    description: "12 FL OZ (355 mL) - verified accurate",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export const currentUser = {
  id: "user1",
  name: "Sarah Johnson",
  email: "sarah@company.com",
  role: "Lead Auditor" as const,
  avatar: "/placeholder.svg?height=32&width=32",
}

export const sampleThreadComments = [
  {
    id: "thread-1",
    content:
      "I've reviewed the nutrition facts panel and found several compliance issues that need immediate attention.",
    author: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Lead Auditor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
    reactions: [
      { type: "like" as const, userId: "user2" },
      { type: "urgent" as const, userId: "user3" },
    ],
  },
  {
    id: "thread-2",
    content:
      "Thanks for flagging this! Can you specify which sections are problematic? I want to prioritize the fixes correctly.",
    author: {
      id: "user3",
      name: "Alex Rivera",
      email: "alex@company.com",
      role: "Brand Manager" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
  },
  {
    id: "thread-3",
    content:
      "The main issues are: 1) Serving size format is incorrect, 2) Vitamin D value is missing, 3) Added sugars line is not properly indented. All are FDA compliance requirements.",
    author: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Lead Auditor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "open" as const,
    priority: "high" as const,
  },
  {
    id: "thread-4",
    content:
      "I can handle the formatting issues. For the Vitamin D value, do we have the lab results from the latest batch testing?",
    author: {
      id: "user6",
      name: "Design Team",
      email: "design@company.com",
      role: "Designer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "high" as const,
  },
  {
    id: "thread-5",
    content:
      "Yes, I have the latest lab results. Vitamin D content is 2.1 mcg per serving. I'll send you the complete nutritional analysis spreadsheet.",
    author: {
      id: "user4",
      name: "Dr. Lisa Park",
      email: "lisa@company.com",
      role: "Nutritionist" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "in_progress" as const,
    priority: "high" as const,
    sourceReference: {
      id: "ref-vitamin-d",
      url: "/documents/lab-results-vitamin-d-analysis.pdf",
      label: "Vitamin D Lab Analysis Report",
      description: "Complete nutritional analysis including Vitamin D content verification",
      type: "document" as const,
      metadata: {
        pageTitle: "Lab Results - Vitamin D Content Analysis",
        batchNumber: "VD-2024-0318",
        testDate: "2024-03-18",
      },
    },
    reactions: [{ type: "like" as const, userId: "user6" }],
  },
  {
    id: "thread-6",
    content:
      "Perfect! I've updated the nutrition facts panel with all the corrections. The new version addresses all compliance issues mentioned. Ready for final review.",
    author: {
      id: "user6",
      name: "Design Team",
      email: "design@company.com",
      role: "Designer" as const,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    parentId: "thread-1",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: "resolved" as const,
    priority: "high" as const,
    reactions: [
      { type: "like" as const, userId: "user1" },
      { type: "like" as const, userId: "user3" },
      { type: "like" as const, userId: "user4" },
    ],
  },
]

export const sampleComment = {
  id: "sample",
  content:
    "This is a sample comment to demonstrate different design variations. Each style offers unique benefits for different use cases and user preferences.",
  author: {
    id: "user1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Lead Auditor" as const,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  status: "open" as const,
  priority: "medium" as const,
  reactions: [
    { type: "like" as const, userId: "user2" },
    { type: "like" as const, userId: "user3" },
  ],
}

export const mentionSources = [
  { id: "user-1", name: "John Smith", type: "user" as const, avatar: "/placeholder.svg?height=32&width=32" },
  { id: "user-2", name: "Sarah Johnson", type: "user" as const, avatar: "/placeholder.svg?height=32&width=32" },
  { id: "user-3", name: "Mike Chen", type: "user" as const, avatar: "/placeholder.svg?height=32&width=32" },
]

export const tagSources = [
  {
    id: "question1.3.1",
    label: "question1.3.1",
    type: "question" as const,
    description: "Nutrition Facts Panel Requirements",
  },
  { id: "rule3.1.3", label: "rule3.1.3", type: "rule" as const, description: "FDA Labeling Guidelines" },
  { id: "section2.4", label: "section2.4", type: "section" as const, description: "Allergen Statement Requirements" },
  { id: "front-label", label: "Front Label", type: "label" as const, description: "Primary product label design" },
  {
    id: "nutrition-panel",
    label: "Nutrition Panel",
    type: "label" as const,
    description: "Nutritional information display",
  },
  {
    id: "usda-cert",
    label: "USDA Organic Certification",
    type: "document" as const,
    description: "Official organic certification document",
  },
]
