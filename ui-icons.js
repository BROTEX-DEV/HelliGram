/* HelliGram UI icons: replace interface emoji with consistent Lucide SVG icons. */
(function () {
  'use strict';
  const iconMap = {
    '☰':'menu','📷':'camera','💬':'message-circle','🔔':'bell','🛡':'shield-check','🛡️':'shield-check',
    '🔄':'refresh-cw','🚪':'log-out','👥':'users','✎':'pencil','✏️':'pencil','🎙':'mic','🎙️':'mic',
    '☺':'smile','➕':'plus','🗑':'trash-2','🗑️':'trash-2','🔐':'lock-keyhole','🔒':'lock','🔓':'lock-open',
    '💾':'save','🎓':'graduation-cap','👤':'user-round','✓':'check','✔️':'check','✕':'x','❌':'x',
    '📄':'file-text','📘':'book-open','📚':'book-open','🎬':'clapperboard','🔬':'microscope','👀':'eye',
    '🧑‍🏫':'presentation','🏫':'school','✋':'hand','🔊':'volume-2','🔇':'volume-x','🟢':'circle-check',
    '📹':'video','🎥':'video','📞':'phone','☎️':'phone','📎':'paperclip','📌':'pin','⚙️':'settings',
    '⚙':'settings','🔍':'search','🔎':'search','📁':'folder','📂':'folder-open','⬇️':'download',
    '⬆️':'upload','🔗':'link','🌐':'globe','📅':'calendar-days','🕒':'clock-3','⏰':'alarm-clock',
    '⭐':'star','✨':'sparkles','✦':'sparkles','⚠️':'triangle-alert','⚠':'triangle-alert',
    'ℹ️':'info','❓':'circle-help','❗':'circle-alert','❤️':'heart','🤍':'heart','🧑':'user-round',
    '🏆':'trophy','🎯':'target','📝':'notebook-pen','📖':'book-open','🔑':'key-round','🔈':'volume-1',
    '🚫':'ban','⏳':'hourglass','🔃':'refresh-cw','➖':'minus','➡️':'arrow-right','⬅️':'arrow-left',
    '▶️':'play','⏸️':'pause','⏹️':'square','🔴':'circle','🟡':'circle','🟠':'circle',
    '🧑‍💻':'laptop','💻':'laptop','🖥️':'monitor','📢':'megaphone','📣':'megaphone',
    '🔔':'bell','🔕':'bell-off','📤':'send','📩':'mail','✉️':'mail','📧':'mail',
    '👋':'hand','🤚':'hand','🙋':'hand','🙋‍♂️':'hand','🙋‍♀️':'hand','🧑‍🎓':'graduation-cap',
    '📊':'chart-no-axes-column','🧹':'brush','🛠️':'wrench','🛠':'wrench','🔧':'wrench',
    '🏠':'house','🚀':'rocket','💡':'lightbulb','🔋':'battery','📍':'map-pin','🗓️':'calendar-days'
  };
  const sequence = Object.keys(iconMap).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
  const emojiPattern = new RegExp(sequence + '|\\p{Extended_Pictographic}(?:\\uFE0F)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F)?)*','gu');
  const skipSelector = 'script,style,textarea,input,select,option,[contenteditable="true"],#emojiPicker,#chatBody,.message,.messageText,.messageBubble,.chatMessage,.msgText';
  function iconFor(emoji) { return iconMap[emoji] || iconMap[emoji.replace(/\uFE0F/g,'')] || 'sparkles'; }
  function shouldSkip(node) {
    const parent = node.parentElement;
    return !parent || parent.closest(skipSelector) || parent.closest('[data-ui-icon-processed="true"]');
  }
  function replaceTextNode(node) {
    if (!node.nodeValue || shouldSkip(node) || !emojiPattern.test(node.nodeValue)) { emojiPattern.lastIndex = 0; return; }
    emojiPattern.lastIndex = 0;
    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let last = 0, match;
    while ((match = emojiPattern.exec(text))) {
      if (match.index > last) fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', iconFor(match[0]));
      icon.className = 'hg-ui-icon';
      icon.setAttribute('aria-hidden', 'true');
      fragment.appendChild(icon);
      last = match.index + match[0].length;
    }
    if (last === 0) return;
    if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(fragment, node);
  }
  function process(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { replaceTextNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches(skipSelector)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceTextNode);
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 2, class: 'hg-ui-icon' } });
    }
  }
  function install() {
    const style = document.createElement('style');
    style.textContent = '.hg-ui-icon{display:inline-block;width:1.05em;height:1.05em;vertical-align:-.16em;stroke-width:2;flex:0 0 auto;margin-inline:2px;}.hg-ui-icon.lucide{width:1.05em;height:1.05em;}button .hg-ui-icon{pointer-events:none;}';
    document.head.appendChild(style);
    process(document.body);
    const observer = new MutationObserver(records => records.forEach(record => {
      record.addedNodes.forEach(node => process(node));
    }));
    observer.observe(document.body, { childList: true, subtree: true });
    const lib = document.createElement('script');
    lib.src = 'https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js';
    lib.async = true;
    lib.onload = () => process(document.body);
    document.head.appendChild(lib);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();