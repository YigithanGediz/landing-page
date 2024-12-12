// Modal and Articles Logic
const projectItems = document.querySelectorAll('.project-item');
const articleModal = document.getElementById('articleModal');
const articleContainer = document.getElementById('articleContainer');

projectItems.forEach(item => {
  item.addEventListener('click', () => {
    const articleId = item.getAttribute('data-article-id');
    openArticle(articleId);
  });
});

function openArticle(articleId) {
  // Hide previously displayed article if any
  articleContainer.innerHTML = '';

  // Clone the article content
  const articleContent = document.getElementById(articleId);
  if(articleContent) {
    const clone = articleContent.cloneNode(true);
    clone.style.display = 'block';
    articleContainer.appendChild(clone);
    articleModal.style.display = 'block';
  }
}

function closeArticle() {
  articleModal.style.display = 'none';
  articleContainer.innerHTML = '';
}

// Close modal when clicking outside the content
window.addEventListener('click', (e) => {
  if (e.target === articleModal) {
    closeArticle();
  }
});
