/**
 * Test Query Endpoint for Zero-LLM Docling + Voyage Context-3 Pipeline
 * =====================================================================
 *
 * Compares the new pipeline (Docling + voyage-context-3 + rerank-2.5) against
 * the production pipeline. Uses the same synthesis but different retrieval.
 *
 * POST /api/ask-test
 * Body: { "query": "..." }
 *
 * Returns SSE stream identical to /api/ask for easy comparison.
 */

import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Voyage AI settings
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const EMBED_MODEL = "voyage-context-3";
const RERANK_MODEL = "rerank-2.5";

// Groq settings (reuse from main endpoint)
const GROQ_API_KEYS = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "").split(",").filter(Boolean);
let groqKeyIndex = 0;

// Paths
const EMBEDDINGS_PATH = path.join(process.cwd(), "data/page-indexes-docling-test/embeddings-voyage-context3.json");

// Types
interface Section {
  doc_id: string;
  doc_title: string;
  course: string;
  node_id: string;
  section_title: string;
  start_page: number;
  end_page: number;
  chunk_index: number;
  total_chunks: number;
  text: string;
  bm25_text: string;
  embedding: number[];
}

interface EmbeddingsData {
  model: string;
  dimensions: number;
  count: number;
  sections: Section[];
}

// Cache
let embeddingsCache: EmbeddingsData | null = null;

function loadEmbeddings(): EmbeddingsData {
  if (embeddingsCache) return embeddingsCache;

  if (!fs.existsSync(EMBEDDINGS_PATH)) {
    throw new Error("Embeddings not found. Run embed-voyage-context.py first.");
  }

  const data = JSON.parse(fs.readFileSync(EMBEDDINGS_PATH, "utf-8"));
  embeddingsCache = data;
  return data;
}

// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// BM25-style keyword scoring
function bm25Score(query: string, text: string): number {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const textLower = text.toLowerCase();

  let score = 0;
  for (const term of queryTerms) {
    const regex = new RegExp(`\\b${term}`, "gi");
    const matches = textLower.match(regex);
    if (matches) {
      score += Math.log(1 + matches.length);
    }
  }

  // Boost for exact phrase matches
  if (textLower.includes(query.toLowerCase())) {
    score *= 2;
  }

  return score;
}

// Embed query with Voyage
async function embedQuery(query: string): Promise<number[]> {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: [query],
      input_type: "query",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage embed error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Rerank with Voyage rerank-2.5
async function rerankResults(
  query: string,
  documents: { text: string; index: number }[],
  topK: number = 10
): Promise<number[]> {
  if (documents.length === 0) return [];

  const response = await fetch("https://api.voyageai.com/v1/rerank", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: RERANK_MODEL,
      query: query,
      documents: documents.map(d => d.text),
      top_k: topK,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Voyage rerank error: ${error}`);
    // Fall back to original order
    return documents.slice(0, topK).map(d => d.index);
  }

  const data = await response.json();
  return data.data.map((r: { index: number }) => documents[r.index].index);
}

// Hybrid search: vector + BM25 + rerank
async function hybridSearch(query: string, topK: number = 5): Promise<Section[]> {
  const embeddings = loadEmbeddings();

  // Embed query
  const queryEmbedding = await embedQuery(query);

  // Score all sections
  const scored = embeddings.sections.map((section, index) => {
    const vectorScore = cosineSimilarity(queryEmbedding, section.embedding);
    const keywordScore = bm25Score(query, section.bm25_text);

    // Reciprocal Rank Fusion
    const vectorRank = index; // Will be sorted
    const keywordRank = index;

    return {
      section,
      index,
      vectorScore,
      keywordScore,
      // Combined score (will refine after sorting)
      combinedScore: vectorScore * 0.7 + (keywordScore / 10) * 0.3,
    };
  });

  // Sort by combined score
  scored.sort((a, b) => b.combinedScore - a.combinedScore);

  // Take top 25 for reranking
  const candidates = scored.slice(0, 25);

  // Rerank with Voyage
  const rerankedIndices = await rerankResults(
    query,
    candidates.map(c => ({ text: c.section.text, index: c.index })),
    topK
  );

  // Return reranked results
  return rerankedIndices.map(idx => {
    const candidate = candidates.find(c => c.index === idx);
    return candidate!.section;
  });
}

// Get next Groq key
function getNextGroqKey(): string {
  const key = GROQ_API_KEYS[groqKeyIndex % GROQ_API_KEYS.length];
  groqKeyIndex++;
  return key;
}

// Synthesize answer with Groq
async function synthesize(
  query: string,
  sections: Section[]
): Promise<ReadableStream> {
  // Build context
  let context = "";
  for (const section of sections) {
    context += `\n---\nDocument: ${section.doc_title}\n`;
    context += `Section: ${section.section_title} (pp. ${section.start_page}-${section.end_page})\n\n`;
    context += section.text.slice(0, 4000);
    context += "\n";
  }

  const systemPrompt = `You are SustainIQ, an expert assistant for sustainability professionals. Answer based ONLY on the provided context. If the context doesn't contain the answer, say so honestly.

Format guidelines:
- Use ## for main headings, ### for subheadings
- Use bullet points for lists
- Cite sources inline as (Document Name, p. XX)
- Be precise and professional`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getNextGroqKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${query}` },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  return response.body!;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if embeddings exist
    if (!fs.existsSync(EMBEDDINGS_PATH)) {
      return new Response(
        JSON.stringify({ error: "Test embeddings not found. Run the indexing pipeline first." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hybrid search with reranking
    const sections = await hybridSearch(query, 5);

    if (sections.length === 0) {
      return new Response(
        JSON.stringify({ error: "No relevant content found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare sources for response
    const sources = sections.map(s => ({
      document: s.doc_title,
      section: s.section_title,
      pages: `${s.start_page}-${s.end_page}`,
      course: s.course,
    }));

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Get Groq stream
          const groqStream = await synthesize(query, sections);
          const reader = groqStream.getReader();
          const decoder = new TextDecoder();

          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Parse SSE chunks
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ type: "text", content })}\n\n`)
                    );
                  }
                } catch {}
              }
            }
          }

          // Send sources
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`)
          );

          // Send retrieval metadata (for debugging/comparison)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: "metadata",
              pipeline: "zero-llm-docling",
              embed_model: EMBED_MODEL,
              rerank_model: RERANK_MODEL,
              sections_retrieved: sections.length
            })}\n\n`)
          );

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", content: String(error) })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
