import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or anonymous key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_TASKS = [
    {
        id: '01',
        title: 'Passeports',
        description: 'Les passeports doivent porter vos professions (informaticien(ne)).',
        details: 'Scanner dans une bureautique. Vérifier date validité.',
        subtasks: [
            { text: 'Pavel: Vérifier mention "Informaticien"', completed: false },
            { text: 'Ariane: Vérifier mention "Informaticienne"', completed: false },
            { text: 'Scanner page identification (PDF)', completed: false }
        ],
        deadline: '2025-12-19',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 220000, // 110k * 2
        isDateTentative: false
    },
    {
        id: '02',
        title: 'Casier judiciaire',
        description: 'Moins de trois mois au moment du dépôt.',
        details: 'Scanner dans une bureautique.',
        subtasks: [
            { text: 'Demande au tribunal', completed: false },
            { text: 'Récupération originaux', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 5000,
        isDateTentative: false
    },
    {
        id: '03',
        title: 'Visite Médicale',
        description: 'Prendre RDV au plus tôt à Douala (environ 230 000 FCFA).',
        details: 'À définir en fonction du RDV. Contacter centre agréé.',
        subtasks: [
            { text: 'Prise de RDV', completed: false },
            { text: 'Radio & Examens', completed: false },
            { text: 'Paiement frais', completed: false }
        ],
        deadline: '2025-12-30',
        priority: 'high',
        critical: false,
        shared: true,
        cost: 230000,
        isDateTentative: true
    },
    {
        id: '04',
        title: 'Photos (Format RP)',
        description: '50mm x 70mm. Lieu conseillé : SOPHIN Sarl (Akwa).',
        details: 'Ils connaissent les dimensions pour la demande de RP.',
        subtasks: [
            { text: 'Prise de photo (Ariane & Pavel)', completed: false },
            { text: 'Récupération fichiers numériques', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 5000,
        isDateTentative: false
    },
    {
        id: '05',
        title: 'Documents Civils (Naissance & CNI)',
        description: 'Scanner dans une bureautique (Pas de téléphone !).',
        details: 'Actes de naissance visibles au complet + CNI recto-verso bien claires.',
        subtasks: [
            { text: 'Scanner Acte Naissance (Ariane)', completed: false },
            { text: 'Scanner Acte Naissance (Pavel)', completed: false },
            { text: 'Scanner CNI Recto-Verso (Ariane)', completed: false },
            { text: 'Scanner CNI Recto-Verso (Pavel)', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 2000,
        isDateTentative: false
    },
    {
        id: '06',
        title: 'Diplômes (Bac, Licence...)',
        description: 'Scanner dans une bureautique (Pas de téléphone).',
        details: 'Joindre aussi les attestations de réussite si disponibles.',
        subtasks: [
            { text: 'Scanner Diplômes Ariane', completed: false },
            { text: 'Scanner Diplômes Pavel', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 0,
        isDateTentative: false
    },
    {
        id: '07',
        title: 'Preuve des conjoints (Union de Fait)',
        description: 'Cohabitation > 12 mois. Factures aux deux noms.',
        details: 'CRITIQUE. Certificat déclaration notarié, Factures électro (TV, Frigo), Services publics, Bail.',
        subtasks: [
            { text: 'Certificat déclaration (Notaire)', completed: false },
            { text: 'Factures Electro (2 noms)', completed: false },
            { text: 'Contrat de location (2 noms)', completed: false },
            { text: 'Factures ENEO/Internet', completed: false }
        ],
        deadline: '2025-12-19',
        priority: 'critical',
        critical: true,
        shared: true,
        cost: 25000,
        isDateTentative: false
    },
    {
        id: '08',
        title: 'Preuves professionnelles',
        description: 'Attestations, Fiches de paie, Contrats (40h/sem).',
        details: 'Ariane: New BTP (Tech Réseau) | Pavel: GRACOVI (Gestionnaire Sys).\nContacter chefs d\'entreprise pour signature.',
        subtasks: [
            { text: 'Signatures New BTP (Ariane)', completed: false },
            { text: 'Signatures GRACOVI (Pavel)', completed: false },
            { text: 'Rassembler fiches de paie', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'critical',
        critical: true,
        shared: false,
        cost: 0,
        isDateTentative: false
    },
    {
        id: '09',
        title: 'Frais de résidence',
        description: '1 500 000 FCFA environ. À payer dans 35 jours.',
        subtasks: [
            { text: 'Rassembler les fonds', completed: false },
            { text: 'Effectuer paiement en ligne', completed: false }
        ],
        deadline: '2026-01-15',
        priority: 'high',
        critical: false,
        shared: true,
        cost: 1500000,
        isDateTentative: true
    },
    {
        id: '10',
        title: 'Preuve de fond (> 7.8M FCFA)',
        description: 'Attestation domiciliation, Relevés 6 mois, Dons notariés.',
        details: 'CRITIQUE. Pavel doit ajouter Ariane au compte Afriland (Signature conjointe obligatoire).',
        subtasks: [
            { text: 'Ajout Ariane compte Afriland', completed: false },
            { text: 'Certificats de dons (Notaire)', completed: false },
            { text: 'Attestation de solde > 7.8M', completed: false }
        ],
        deadline: '2025-12-31',
        priority: 'critical',
        critical: true,
        shared: true,
        cost: 7800000,
        isDateTentative: false
    },
    {
        id: '12',
        title: 'Tests de langues',
        description: 'TCF (Ariane) et TCF + IELTS (Pavel).',
        details: 'Maximiser les points.',
        subtasks: [
            { text: 'Passage TCF Ariane', completed: false },
            { text: 'Passage TCF Pavel', completed: false },
            { text: 'Passage IELTS Pavel', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'high',
        critical: true,
        shared: false,
        cost: 590000,
        isDateTentative: false
    },
    {
        id: '13',
        title: 'Évaluation WES (EDE)',
        description: 'Ariane ET Pavel. Frais WES + Univ + DHL.',
        details: 'Pour les deux candidats. Création comptes + Envoi docs.',
        subtasks: [
            { text: 'Compte WES Ariane + Paiement', completed: false },
            { text: 'Compte WES Pavel + Paiement', completed: false },
            { text: 'Envoi DHL documents', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'high',
        critical: true,
        shared: true,
        cost: 480000 // Approx for two
    },
    {
        id: '14',
        title: 'CV Canadien',
        description: 'CV conforme aux différents postes visés.',
        subtasks: [
            { text: 'Rédaction CV Ariane (Format Canadien)', completed: false },
            { text: 'Rédaction CV Pavel (Format Canadien)', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 0
    }
].map(t => ({ ...t, ariane: false, pavel: false, expanded: true }));

async function main() {
    const { data, error } = await supabase
        .from('tasks')
        .insert(INITIAL_TASKS);

    if (error) {
        console.error('Error seeding tasks:', error);
    } else {
        console.log('Successfully seeded tasks:', data);
    }
}

main();