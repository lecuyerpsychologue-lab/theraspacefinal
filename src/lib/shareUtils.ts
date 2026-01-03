// Utility functions for sharing and saving module results

export interface JournalEntry {
  id: string;
  moduleName: string;
  title: string;
  content: string;
  date: string;
  type: 'result' | 'note';
}

// Save a result to the journal
export const saveToJournal = (moduleName: string, title: string, content: string): void => {
  const entry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    moduleName,
    title,
    content,
    date: new Date().toISOString(),
    type: 'result'
  };
  
  const existingEntries = JSON.parse(localStorage.getItem('journal-entries') || '[]');
  existingEntries.push(entry);
  localStorage.setItem('journal-entries', JSON.stringify(existingEntries));
};

// Get all journal entries
export const getJournalEntries = (): JournalEntry[] => {
  return JSON.parse(localStorage.getItem('journal-entries') || '[]');
};

// Generate a shareable image (for social media stories)
export const generateShareImage = async (
  title: string,
  content: string,
  moduleName: string
): Promise<string> => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 1080; // Instagram Story size
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#F7F0EA'); // beige
  gradient.addColorStop(1, '#E8DDD0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add logo/title at top
  ctx.fillStyle = '#1A1614';
  ctx.font = 'bold 72px Playfair Display, serif';
  ctx.textAlign = 'center';
  ctx.fillText('TheraSpace', canvas.width / 2, 150);
  
  // Add module name
  ctx.font = '48px Inter, sans-serif';
  ctx.fillStyle = '#5C534A';
  ctx.fillText(moduleName, canvas.width / 2, 250);
  
  // Add title
  ctx.font = 'bold 56px Playfair Display, serif';
  ctx.fillStyle = '#1A1614';
  ctx.textAlign = 'center';
  
  // Word wrap title
  const maxWidth = 900;
  const words = title.split(' ');
  let line = '';
  let y = 400;
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, canvas.width / 2, y);
      line = word + ' ';
      y += 70;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);
  
  // Add content
  ctx.font = '40px Inter, sans-serif';
  ctx.fillStyle = '#5C534A';
  ctx.textAlign = 'left';
  
  // Word wrap content
  const contentWords = content.split(' ');
  let contentLine = '';
  let contentY = y + 150;
  const contentMaxWidth = 900;
  const leftMargin = (canvas.width - contentMaxWidth) / 2;
  
  for (const word of contentWords) {
    const testLine = contentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > contentMaxWidth && contentLine !== '') {
      ctx.fillText(contentLine, leftMargin, contentY);
      contentLine = word + ' ';
      contentY += 55;
      
      // Stop if we're getting too long
      if (contentY > 1700) break;
    } else {
      contentLine = testLine;
    }
  }
  if (contentY < 1700) {
    ctx.fillText(contentLine, leftMargin, contentY);
  }
  
  // Add footer
  ctx.font = '32px Inter, sans-serif';
  ctx.fillStyle = '#5C534A';
  ctx.textAlign = 'center';
  ctx.fillText(new Date().toLocaleDateString('fr-FR'), canvas.width / 2, 1800);
  
  // Convert canvas to data URL
  return canvas.toDataURL('image/png');
};

// Download the share image
export const downloadShareImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

// Share via Web Share API (if available) or download
export const shareContent = async (
  title: string,
  content: string,
  moduleName: string
): Promise<void> => {
  try {
    const imageDataUrl = await generateShareImage(title, content, moduleName);
    
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const file = new File([blob], `theraspace-${moduleName.toLowerCase()}.png`, { type: 'image/png' });
    
    // Try Web Share API first
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `TheraSpace - ${moduleName}`,
        text: title,
        files: [file]
      });
    } else {
      // Fallback to download
      downloadShareImage(imageDataUrl, `theraspace-${moduleName.toLowerCase()}.png`);
    }
  } catch (error) {
    console.error('Error sharing content:', error);
    // Fallback to download
    const imageDataUrl = await generateShareImage(title, content, moduleName);
    downloadShareImage(imageDataUrl, `theraspace-${moduleName.toLowerCase()}.png`);
  }
};
