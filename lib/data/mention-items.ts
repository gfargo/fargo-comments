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
    { value: "question1.3.1", id: "q-1-3-1", description: "Net weight declaration requirements" },
    { value: "question2.1.4", id: "q-2-1-4", description: "Ingredient listing order" },
    { value: "question3.2.1", id: "q-3-2-1", description: "Allergen declaration format" },

    // Rules
    { value: "rule3.1.3", id: "r-3-1-3", description: "FDA labeling compliance rule" },
    { value: "rule2.4.1", id: "r-2-4-1", description: "Nutrition facts panel requirements" },
    { value: "rule1.2.5", id: "r-1-2-5", description: "Product name standards" },

    // Sections
    { value: "section2.4", id: "s-2-4", description: "Nutritional information section" },
    { value: "section1.1", id: "s-1-1", description: "Product identification section" },
    { value: "section4.3", id: "s-4-3", description: "Claims and certifications section" },

    // Labels and Documents
    { value: "front-label", id: "label-front", description: "Product front panel label" },
    { value: "back-label", id: "label-back", description: "Product back panel label" },
    { value: "nutrition-panel", id: "label-nutrition", description: "Nutrition facts panel" },
    { value: "usda-organic-cert", id: "doc-usda", description: "USDA Organic Certification PDF" },
    { value: "recipe-antibiotic-free", id: "doc-recipe", description: "Antibiotic-free poultry recipe PDF" },
    { value: "supplier-certificate", id: "doc-supplier", description: "Supplier quality certificate" },
  ],
}

export const mentionUsers = mentionItems["@"]
export const mentionTags = mentionItems["#"]

export default mentionItems
