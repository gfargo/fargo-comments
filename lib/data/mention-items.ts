import type { MentionUser, MentionTag } from "@/contexts/mention-context"

const mentionItems = {
  "@": [
    { id: "user-1", name: "John Smith", email: "john.smith@company.com" },
    { id: "user-2", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
    { id: "user-3", name: "Mike Chen", email: "mike.chen@company.com" },
    { id: "user-4", name: "Emily Davis", email: "emily.davis@company.com" },
    { id: "user-5", name: "Alex Rodriguez", email: "alex.rodriguez@company.com" },
  ] as MentionUser[],
  "#": [
    {
      id: "q-1-3-1",
      label: "question1.3.1",
      description: "Net weight declaration requirements",
      type: "question" as const,
    },
    { id: "q-2-1-4", label: "question2.1.4", description: "Ingredient listing order", type: "question" as const },
    { id: "q-3-2-1", label: "question3.2.1", description: "Allergen declaration format", type: "question" as const },
    { id: "r-3-1-3", label: "rule3.1.3", description: "FDA labeling compliance rule", type: "rule" as const },
    { id: "r-2-4-1", label: "rule2.4.1", description: "Nutrition facts panel requirements", type: "rule" as const },
    { id: "r-1-2-5", label: "rule1.2.5", description: "Product name standards", type: "rule" as const },
    { id: "s-2-4", label: "section2.4", description: "Nutritional information section", type: "section" as const },
    { id: "s-1-1", label: "section1.1", description: "Product identification section", type: "section" as const },
    { id: "s-4-3", label: "section4.3", description: "Claims and certifications section", type: "section" as const },
    { id: "label-front", label: "front-label", description: "Product front panel label", type: "resource" as const },
    { id: "label-back", label: "back-label", description: "Product back panel label", type: "resource" as const },
    {
      id: "label-nutrition",
      label: "nutrition-panel",
      description: "Nutrition facts panel",
      type: "resource" as const,
    },
    {
      id: "doc-usda",
      label: "usda-organic-cert",
      description: "USDA Organic Certification PDF",
      type: "resource" as const,
      url: "/docs/usda-organic-cert.pdf",
    },
    {
      id: "doc-recipe",
      label: "recipe-antibiotic-free",
      description: "Antibiotic-free poultry recipe PDF",
      type: "resource" as const,
      url: "/docs/recipe-antibiotic-free.pdf",
    },
    {
      id: "doc-supplier",
      label: "supplier-certificate",
      description: "Supplier quality certificate",
      type: "resource" as const,
      url: "/docs/supplier-certificate.pdf",
    },
  ] as MentionTag[],
}

export const mentionUsers = mentionItems["@"]
export const mentionTags = mentionItems["#"]

export default mentionItems
