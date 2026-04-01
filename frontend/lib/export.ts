import JSZip from "jszip";
import { saveAs } from "file-saver";
import { TOPICS, FLASHCARDS, QUIZ } from "./constants";

export const exportToMarkdownZip = async (title: string, summary: string) => {
  const zip = new JSZip();

  // 1. Generate Main Markdown File
  let md = `# ${title}\n\n`;
  md += `## 📋 AI Summary\n${summary}\n\n`;

  md += `## 📚 Topics\n`;
  TOPICS.forEach((t) => {
    md += `### ${t.emoji} ${t.title} (⏱ ${t.time})\n`;
    md += `${t.desc}\n\n`;
    t.bullets.forEach((b) => {
      md += `- ${b}\n`;
    });
    md += `\n`;
  });

  md += `## 🃏 Flashcards\n`;
  FLASHCARDS.forEach((f) => {
    md += `> [!question] ${f.q}\n> ${f.a}\n\n`;
  });

  md += `## ❓ Quiz\n`;
  QUIZ.forEach((q, i) => {
    md += `**Q${i + 1}: ${q.q}**\n`;
    q.options.forEach((opt, j) => {
      const mark = j === q.correct ? "✅" : "⚪";
      md += `- ${mark} ${opt}\n`;
    });
    md += `\n`;
  });

  // Add the markdown file to the zip
  zip.file(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`, md);

  // 2. Add an assets folder with a dummy image (in a real app, we'd render the SVG to PNG here)
  const assetsFolder = zip.folder("assets");
  if (assetsFolder) {
    assetsFolder.file("README.txt", "Mind map and Knowledge graph images would be saved here.");
  }

  // 3. Generate and Download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.zip`);
};
