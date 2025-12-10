import { Quiz } from './types';

export const DEFAULT_APP_NAME = "QuizHub";

// Converting the user's provided questions into our schema
export const DEFAULT_QUIZ: Quiz = {
  id: 'default-rajasthan-quiz',
  title: 'Rajasthan Folk Dance (Lok Nartya)',
  createdAt: Date.now(),
  questions: [
    {
      id: 'q1',
      text: "Ghoomar dance originally belongs to which community?",
      options: ["Rajput", "Bhil", "Meena", "Gurjar"],
      correctIndex: 1,
      explanation: "Ghoomar का मूल भील समुदाय है। बाद में राजपूतों ने इसे अपनाया और यह मेवाड़ क्षेत्र का प्रमुख लोक नृत्य बना।"
    },
    {
      id: 'q2',
      text: "Which Rajasthani dance is included in UNESCO’s Intangible Cultural Heritage list?",
      options: ["Chari", "Kalbeliya", "Gair", "Bhavai"],
      correctIndex: 1,
      explanation: "Kalbeliya (Sapera समुदाय का नृत्य) को 2010 में UNESCO Intangible Cultural Heritage सूची में शामिल किया गया।"
    },
    {
      id: 'q3',
      text: "Which dance involves balancing multiple pots (matkas) on the head?",
      options: ["Bhavai", "Terah Taal", "Chakri", "Chari"],
      correctIndex: 0,
      explanation: "Bhavai में महिलाएँ सिर पर कई मटके (8–11 या उससे अधिक) संतुलित करके नृत्य करती हैं, कभी तलवार या काँच पर भी।"
    },
    {
      id: 'q4',
      text: "Which Rajasthani dance uses 13 manjiras tied to the body?",
      options: ["Gair", "Kalbeliya", "Terah Taal", "Chari"],
      correctIndex: 2,
      explanation: "Terah Taal में शरीर पर 13 मंजीरे बाँधकर बैठकर लयबद्ध नृत्य किया जाता है।"
    },
    {
      id: 'q5',
      text: "Kachchi Ghodi dance is mainly associated with which region of Rajasthan?",
      options: ["Marwar", "Shekhawati", "Mewar", "Hadoti"],
      correctIndex: 1,
      explanation: "Kachchi Ghodi, नकली घोड़े की पोशाक वाला नृत्य, मुख्यतः शेखावाटी क्षेत्र से जुड़ा है।"
    }
  ]
};