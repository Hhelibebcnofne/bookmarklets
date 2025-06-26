const copyToClipboard = async (clipboardItem: ClipboardItem): Promise<void> => {
  try {
    await navigator.clipboard.write([clipboardItem]);
    console.log('Link copied to clipboard successfully!');
  } catch (err) {
    console.error('Failed to copy link: ', err);
  }
};

const main = async (): Promise<void> => {
  if (!navigator.clipboard) {
    console.error('Clipboard API not supported');
    return;
  }
  const title: string = document.title;
  const url: string = document.location.href;
  const clipboardItemData: Record<string, string> = {
    'text/html': `<a href="${url}">${title}</a>`,
    'text/plain': `[${title}](${url})`
  };
  const clipboardItem: ClipboardItem = new ClipboardItem(
    Object.fromEntries(
      Object.entries(clipboardItemData).map(([type, data]) => [type, new Blob([data], { type })])
    )
  );

  await copyToClipboard(clipboardItem);
};

main();

