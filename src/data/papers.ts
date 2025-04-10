import { ResearchPaper, Review } from "../types";
import { users } from "./users";

export const reviews: Review[] = [
  {
    id: "review-1",
    reviewer: users[1],
    content: "This paper presents a novel approach to CRISPR gene editing with significant potential. The methodology is sound, though I suggest expanding on the ethical considerations in section 4.",
    rating: 4,
    date: "2023-11-10",
    status: "completed",
    tokens: 50
  },
  {
    id: "review-2",
    reviewer: users[0],
    content: "While the quantum computing algorithm shows promise, the benchmarking methodology needs revision. The comparison to classical algorithms isn't adequately controlled.",
    rating: 3,
    date: "2023-10-25",
    status: "completed",
    tokens: 50
  },
  {
    id: "review-3",
    reviewer: users[1],
    content: "Excellent methodology and groundbreaking results. The implications for targeted gene therapy are significant and well articulated.",
    rating: 5,
    date: "2023-09-15",
    status: "completed",
    tokens: 60
  },
  {
    id: "review-4",
    reviewer: users[0],
    content: "The mathematical model is elegant, but some assumptions may not hold in real-world scenarios. Suggest including sensitivity analysis.",
    rating: 4,
    date: "2023-12-01",
    status: "completed",
    tokens: 45
  },
  {
    id: "review-5",
    reviewer: users[2],
    content: "Pending review",
    rating: 0,
    date: "",
    status: "pending",
    tokens: 0
  },
  {
    id: "review-6",
    reviewer: users[3],
    content: "This climate model effectively incorporates recent data, but the timeframe projections seem optimistic given current emissions trajectories.",
    rating: 4,
    date: "2023-11-28",
    status: "completed",
    tokens: 55
  },
  {
    id: "review-7",
    reviewer: users[3],
    content: "Pending review",
    rating: 0,
    date: "",
    status: "pending",
    tokens: 0
  }
];

export const papers: ResearchPaper[] = [
  {
    id: "paper-1",
    title: "Novel CRISPR-Cas9 Delivery Systems for Targeted Gene Therapy",
    abstract: "This study introduces an innovative nanoparticle-based delivery system for CRISPR-Cas9 gene editing technology that significantly increases targeting precision while reducing off-target effects. We demonstrate efficacy in both in vitro and in vivo models of cystic fibrosis.",
    content: `# Introduction
    
Gene therapy has long held promise for treating genetic disorders by directly addressing their root causes. The CRISPR-Cas9 system has revolutionized this field by offering unprecedented precision in genome editing. However, efficient and safe delivery of CRISPR components to target tissues remains a significant challenge.

# Methods

We developed a novel lipid nanoparticle formulation (LNP-X) incorporating cell-specific targeting ligands and pH-responsive elements. The system was characterized using dynamic light scattering, transmission electron microscopy, and in vitro transfection assays. Efficacy was tested in both cell culture models and in CFTR-deficient mouse models.

# Results

LNP-X demonstrated superior cellular uptake in lung epithelial cells compared to conventional delivery systems (87% vs 34%, p<0.001). Off-target effects were reduced by 76% while maintaining on-target editing efficiency. In vivo studies showed successful correction of the CFTR gene in 64% of targeted lung epithelial cells, with restoration of chloride channel function.

# Discussion

These findings represent a significant advancement in CRISPR delivery technology with immediate applications for cystic fibrosis treatment and broader implications for other genetic disorders requiring tissue-specific gene editing.`,
    author: users[0],
    date: "2023-10-15",
    category: "Genetics",
    status: "published",
    reviews: [reviews[0], reviews[2]],
    doi: "10.1234/journal.gen.2023.10.15",
    views: 1243,
    citations: 17,
    tokens: 450,
    hash: "0x7c3b2d0e1f6a5c8b9d2e3f4a5c6b7d8e9f0a1b2c",
    keywords: ["CRISPR-Cas9", "Gene Therapy", "Nanoparticles", "Cystic Fibrosis", "Targeted Delivery"]
  },
  {
    id: "paper-2",
    title: "Quantum Algorithm for Linear Systems with Exponential Speedup",
    abstract: "We present a new quantum algorithm for solving large systems of linear equations that achieves exponential speedup compared to classical methods. This approach overcomes previous limitations in quantum linear algebra and has direct applications in machine learning and computational fluid dynamics.",
    content: `# Introduction

Solving large systems of linear equations is a fundamental computational task with applications across science and engineering. While classical algorithms require time polynomial in the system size, quantum algorithms have shown potential for exponential speedups. However, existing approaches have significant practical limitations.

# Quantum Algorithm Design

Our algorithm builds on the HHL framework but incorporates novel quantum circuit designs that reduce qubit requirements and circuit depth. We employ a modified quantum phase estimation procedure combined with a non-unitary transformation implemented through a carefully designed probabilistic error correction scheme.

# Performance Analysis

Theoretical analysis demonstrates an O(log(N)) runtime dependency for N×N systems, compared to O(N) for the best quantum algorithms to date and O(N²) for classical methods. Numerical simulations on systems with up to 1024 variables confirm the expected scaling advantages.

# Applications

We demonstrate our algorithm's practical utility by applying it to machine learning classification problems and fluid dynamics simulations, showing dramatic performance improvements over state-of-the-art classical techniques.`,
    author: users[1],
    date: "2023-11-05",
    category: "Quantum Computing",
    status: "published",
    reviews: [reviews[1], reviews[3]],
    doi: "10.5678/journal.qcomp.2023.11.05",
    views: 876,
    citations: 9,
    tokens: 380,
    hash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    keywords: ["Quantum Computing", "Linear Systems", "Algorithm Design", "HHL Algorithm", "Computational Speedup"]
  },
  {
    id: "paper-3",
    title: "Epigenetic Markers for Early Detection of Neurodegenerative Disorders",
    abstract: "This research identifies a panel of epigenetic biomarkers in peripheral blood that predict the onset of Alzheimer's disease with 94% accuracy up to 8 years before clinical symptoms appear. The findings provide new insights into disease mechanisms and offer potential for early intervention.",
    content: "Detailed content about epigenetic markers and neurodegenerative disorders...",
    author: users[0],
    date: "2023-08-22",
    category: "Neuroscience",
    status: "under review",
    reviews: [reviews[4]],
    views: 421,
    citations: 0,
    tokens: 180,
    keywords: ["Epigenetics", "Neurodegenerative Disorders", "Alzheimer's Disease", "Biomarkers", "Early Detection"]
  },
  {
    id: "paper-4",
    title: "Climate Change Adaptation Strategies for Coastal Urban Areas",
    abstract: "This paper analyzes the effectiveness of various climate change adaptation strategies implemented in coastal urban areas across five continents. We provide a framework for assessing resilience and recommend policy approaches based on successful case studies.",
    content: "Detailed content about climate change adaptation strategies...",
    author: users[2],
    date: "2023-12-03",
    category: "Climate Science",
    status: "published",
    reviews: [reviews[5], reviews[6]],
    doi: "10.9101/journal.clim.2023.12.03",
    views: 589,
    citations: 4,
    tokens: 320,
    hash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
    keywords: ["Climate Change", "Urban Planning", "Coastal Cities", "Adaptation Strategies", "Resilience"]
  }
];

export const getPaperById = (id: string) => {
  return papers.find(paper => paper.id === id);
};

export const getPublishedPapers = () => {
  return papers.filter(paper => paper.status === "published");
};

export const getReviewById = (id: string) => {
  return reviews.find(review => review.id === id);
};
