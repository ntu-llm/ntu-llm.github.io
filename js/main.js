// Progressive enhancement: without JavaScript, both courses remain readable.
const tabList = document.querySelector('.course-tabs');
if (tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  panels.forEach((panel, index) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[index].id);
    panel.tabIndex = 0;
  });
  function selectCourse(id) {
    tabs.forEach((tab, index) => {
      const selected = panels[index].id === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index].hidden = !selected;
    });
  }
  function syncHash() {
    const target = document.getElementById(location.hash.slice(1));
    const panel = target?.closest('.course');
    selectCourse(panel?.id || panels[0].id);
  }
  function activate(tab) {
    const id = tab.getAttribute('aria-controls');
    selectCourse(id);
    // Preserve native Back/Forward navigation without jumping down the page.
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
  }
  tabs.forEach(tab => tab.addEventListener('click', () => activate(tab)));
  tabList.addEventListener('keydown', event => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    activate(tabs[next]);
  });
  window.addEventListener('popstate', syncHash);
  window.addEventListener('hashchange', syncHash);
  tabList.hidden = false;
  document.documentElement.classList.add('tabs-enabled');
  syncHash();
}
