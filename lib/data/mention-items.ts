const mentionItems = {
  "@": [
    { value: "John Smith", id: "user-1", email: "john.smith@company.com" },
    { value: "Sarah Johnson", id: "user-2", email: "sarah.johnson@company.com" },
    { value: "Mike Chen", id: "user-3", email: "mike.chen@company.com" },
    { value: "Emily Davis", id: "user-4", email: "emily.davis@company.com" },
    { value: "Alex Rodriguez", id: "user-5", email: "alex.rodriguez@company.com" },
  ],
  "#": [
    // Questions
    {
      label: "question1.3.1",
      id: "q-1-3-1",
      description: "Net weight declaration requirements",
      type: "question" as const,
      url: "/questions/1.3.1",
    },
    {
      label: "question2.1.4",
      id: "q-2-1-4",
      description: "Ingredient listing order",
      type: "question" as const,
      url: "/questions/2.1.4",
    },
    {
      label: "question3.2.1",
      id: "q-3-2-1",
      description: "Allergen declaration format",
      type: "question" as const,
      url: "/questions/3.2.1",
    },

    // Rules
    {
      label: "rule3.1.3",
      id: "r-3-1-3",
      description: "FDA labeling compliance rule",
      type: "rule" as const,
      url: "/rules/3.1.3",
    },
    {
      label: "rule2.4.1",
      id: "r-2-4-1",
      description: "Nutrition facts panel requirements",
      type: "rule" as const,
      url: "/rules/2.4.1",
    },
    {
      label: "rule1.2.5",
      id: "r-1-2-5",
      description: "Product name standards",
      type: "rule" as const,
      url: "/rules/1.2.5",
    },

    // Sections
    {
      label: "section2.4",
      id: "s-2-4",
      description: "Nutritional information section",
      type: "section" as const,
      url: "/sections/2.4",
    },
    {
      label: "section1.1",
      id: "s-1-1",
      description: "Product identification section",
      type: "section" as const,
      url: "/sections/1.1",
    },
    {
      label: "section4.3",
      id: "s-4-3",
      description: "Claims and certifications section",
      type: "section" as const,
      url: "/sections/4.3",
    },

    // Resources (Labels and Documents)
    {
      label: "front-label",
      id: "label-front",
      description: "Product front panel label",
      type: "resource" as const,
      url: "/resources/labels/front",
    },
    {
      label: "back-label",
      id: "label-back",
      description: "Product back panel label",
      type: "resource" as const,
      url: "/resources/labels/back",
    },
    {
      label: "nutrition-panel",
      id: "label-nutrition",
      description: "Nutrition facts panel",
      type: "resource" as const,
      url: "/resources/labels/nutrition",
    },
    {
      label: "usda-organic-cert",
      id: "doc-usda",
      description: "USDA Organic Certification PDF",
      type: "resource" as const,
      url: "/resources/documents/usda-organic.pdf",
    },
    {
      label: "recipe-antibiotic-free",
      id: "doc-recipe",
      description: "Antibiotic-free poultry recipe PDF",
      type: "resource" as const,
      url: "/resources/documents/recipe-antibiotic-free.pdf",
    },
    {
      label: "supplier-certificate",
      id: "doc-supplier",
      description: "Supplier quality certificate",
      type: "resource" as const,
      url: "/resources/documents/supplier-cert.pdf",
    },
  ],
}

export const mentionUsers = mentionItems["@"]
export const mentionTags = mentionItems["#"]

export default mentionItems
