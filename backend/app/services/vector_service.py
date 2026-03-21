import os
import chromadb
from chromadb.utils import embedding_functions

# Initialize ChromaDB Local Persistent Client
DB_DIR = os.path.join(os.getcwd(), "chroma_data")
os.makedirs(DB_DIR, exist_ok=True)
chroma_client = chromadb.PersistentClient(path=DB_DIR)

# Use OpenAI embeddings 
api_key = os.getenv("OPENAI_API_KEY")

# Fallback to default embeddings if no key
if api_key:
    openai_ef = embedding_functions.OpenAIEmbeddingFunction(
        api_key=api_key,
        model_name="text-embedding-3-small"
    )
    collection = chroma_client.get_or_create_collection(name="lecture_transcripts", embedding_function=openai_ef)
else:
    collection = chroma_client.get_or_create_collection(name="lecture_transcripts")

def split_text_into_chunks(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Simple word-based chunker as alternative to heavy LangChain deps"""
    words = text.split()
    chunks = []
    
    if not words:
        return chunks
        
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i : i + chunk_size])  # type: ignore
        chunks.append(chunk)
        if i + chunk_size >= len(words):
            break
            
    return chunks

async def embed_transcript(video_id: str, transcript: str):
    """
    Chunks a transcript and stores it in ChromaDB with the video_id metadata.
    """
    if not transcript:
        return
        
    chunks = split_text_into_chunks(transcript, chunk_size=300, overlap=50)
    
    ids = [f"{video_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"video_id": video_id, "chunk_index": i} for i in range(len(chunks))]
    
    # Upsert to Chroma
    collection.upsert(
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )
    print(f"✅ Embedded {len(chunks)} chunks for video {video_id}")

async def retrieve_context(video_id: str, query: str, top_k: int = 3) -> str:
    """
    Searches ChromaDB for the most relevant chunks for a given video and query.
    Returns a combined string of context.
    """
    try:
        results = collection.query(
            query_texts=[query],
            n_results=top_k,
            where={"video_id": video_id}
        )
        
        if not results['documents'] or not results['documents'][0]:
            return ""
            
        context_chunks = results['documents'][0]
        
        # Combine into a single context block
        combined_context = "\n---\n".join(context_chunks)
        return combined_context
    except Exception as e:
        print(f"⚠️ Vector search error: {str(e)}")
        return ""
