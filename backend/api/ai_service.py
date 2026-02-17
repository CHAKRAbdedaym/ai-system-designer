# ai_service.py
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

def analyze_system_design(title: str, description: str) -> str:
    """
    Returns clean, structured markdown perfect for ReactMarkdown rendering.
    """
    prompt = f"""
You are a senior staff system architect. Your response MUST be clean, structured markdown ONLY — nothing else.

System title: {title}

User description:
{description}

STRICT RULES — FOLLOW OR THE OUTPUT IS INVALID:
- Start directly with # — NO intro text, NO "here is your answer", NO chit-chat
- Use EXACT section titles and order below — do NOT change names, numbering, or sequence
- Use **bold** for important terms
- Use - for bullet lists
- Use 1. for numbered lists
- Use ```mermaid for high-level diagrams (graph TD or LR syntax)
- Use ``` for code/configuration blocks
- Use > for notes/warnings
- Use markdown tables | when comparing things (e.g. trade-offs, cost)
- Be professional, concise, accurate — no emojis, no hype
- If description is vague, make reasonable assumptions and state them in section 1
- End after the last section — no extra text

Exact output structure — begin immediately:

# System Design: {title}

## 1. Overview & Requirements Summary
Short summary + key requirements list + scale assumptions

## 2. High-Level Architecture
Mermaid diagram in ```mermaid block + brief component list

## 3. Core Components & Data Flow
Detailed components + numbered/step-by-step flow

## 4. Scalability & Performance Strategy
Scaling plan + bottlenecks + mitigations

## 5. Database & Storage Design
DB choice + reasoning + caching/storage

## 6. Reliability & Fault Tolerance
Failure modes + redundancy/retries

## 7. Security & Compliance
Auth + encryption + protections

## 8. Observability & Monitoring
Metrics + logging + tracing + alerting

## 9. Cost & Resource Estimation
Rough costs at different scales + optimizations

## 10. Trade-offs & Alternatives
Pros/cons + 1-2 alternatives

Output ONLY this markdown. No extra lines before or after.
"""

    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",  # your free model
            messages=[
                {"role": "system", "content": "Output ONLY the exact markdown structure requested. No extra text, no chit-chat, no markdown outside the defined sections."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,           # Very low = strict obedience
            max_tokens=5000,
            top_p=0.9,
        )

        if response.choices and response.choices[0].message.content:
            result = response.choices[0].message.content.strip()
            # Safety: cut anything before first # or after last section
            if '#' in result:
                result = result[result.index('#'):]
            return result
        else:
            return "# Error\nNo valid response from AI."

    except Exception as e:
        return f"# AI Service Error\n\n{str(e)}\n\nPlease try again or contact support."